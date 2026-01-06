import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatGroq } from "@langchain/groq";
import { MemorySaver } from "@langchain/langgraph";

import { tools } from "./tools";

/* -------------------- Setup -------------------- */

const checkpointer = new MemorySaver();
const toolNode = new ToolNode(tools);

/* -------------------- Models -------------------- */

// Base model
const baseLLM = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
  maxRetries: 1,
  maxTokens: 768,
});

// Reasoning model
const reasoningLLM = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0,
  maxRetries: 1,
  maxTokens: 768,
});

// Summarizer model
const summarizerLLM = new ChatGroq({
  model: "llama-3.1-8b-instant",
  temperature: 0,
  maxTokens: 300,
});

/* -------------------- Summarization -------------------- */

const SUMMARY_PROMPT = {
  role: "system",
  content: `
Summarize the conversation so far.
Preserve:
- User intent
- Preferences
- Decisions
- Open tasks

Be concise. Use bullet points.
Do NOT include chit-chat.
`,
};

const MAX_RECENT_MESSAGES = 4;
const MAX_TOTAL_MESSAGES = 12;

function isSummaryMessage(message: any) {
  return (
    message.role === "system" &&
    typeof message.content === "string" &&
    message.content.startsWith("Conversation summary:")
  );
}

async function summarizeMessages(messages: any[]) {
  const response = await summarizerLLM.invoke([SUMMARY_PROMPT, ...messages]);

  const summary = {
    role: "system",
    content: `Conversation summary:\n${response.content}`,
  };

  console.log("summary generated:", summary);
  return summary;
}

/* -------------------- Routing -------------------- */

function needsReasoning(messages: any[]) {
  const last = messages[messages.length - 1]?.content ?? "";
  return (
    typeof last === "string" &&
    (last.length > 800 ||
      last.includes("plan") ||
      last.includes("step-by-step") ||
      last.includes("design"))
  );
}

function shouldUseTools(messages: any[]) {
  const last = messages[messages.length - 1]?.content?.toLowerCase?.() ?? "";
  return (
    last.includes("search") ||
    last.includes("latest") ||
    last.includes("news") ||
    last.includes("current") ||
    last.includes("price") ||
    last.includes("weather")
  );
}

function getLLM(messages: any[]) {
  const llm = needsReasoning(messages) ? reasoningLLM : baseLLM;
  return shouldUseTools(messages) ? llm.bindTools(tools) : llm;
}

/* -------------------- Agent Node -------------------- */

async function callModel(state: { messages: any[] }) {
  let messages = state.messages;

  const existingSummary = messages.find(isSummaryMessage);
  const nonSummaryMessages = messages.filter((m) => !isSummaryMessage(m));

  // Only summarize real conversation turns
  if (nonSummaryMessages.length > MAX_TOTAL_MESSAGES) {
    const summary = await summarizeMessages(
      nonSummaryMessages.slice(0, -MAX_RECENT_MESSAGES)
    );

    // Check if the generated summary is non-empty (after trimming)
    const summaryContent =
      typeof summary.content === "string" ? summary.content.trim() : "";

    if (
      summaryContent &&
      summaryContent.replace(/^Conversation summary:\s*/i, "").length > 0
    ) {
      messages = [summary, ...nonSummaryMessages.slice(-MAX_RECENT_MESSAGES)];
    } else if (existingSummary) {
      messages = [existingSummary, ...nonSummaryMessages.slice(-MAX_RECENT_MESSAGES)];
    } else {
      // fallback, no summary, just slice messages
      messages = nonSummaryMessages.slice(-MAX_RECENT_MESSAGES);
    }
  }

  const llm = getLLM(messages);

  try {
    const response = await llm.invoke(messages);
    return { messages: [...messages, response] };
  } catch (err: any) {
    if (err?.status === 429 || err?.status === 413) {
      const fallback = await baseLLM.invoke(messages);
      return { messages: [...messages, fallback] };
    }
    throw err;
  }
}

/* -------------------- Graph Routing -------------------- */

function shouldContinue(state: { messages: any[] }) {
  const toolCalls = state.messages.filter((m) =>
    Array.isArray(m.tool_calls)
  ).length;

  if (toolCalls > 4) return END;
  if (state.messages.length > 20) return END;

  const last = state.messages[state.messages.length - 1];

  // If tool ran but produced no assistant content → retry agent
  if (last?.role === "tool") {
    return "agent";
  }

  if (last?.tool_calls?.length) return "tools";

  return END;
}

/* -------------------- Graph Compile -------------------- */

export const agentGraph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile({ checkpointer });
