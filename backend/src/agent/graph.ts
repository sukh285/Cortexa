// src/agent/graph.ts
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

const checkpointer = new MemorySaver();

/* Initialize tool node */
const toolNode = new ToolNode(tools);

/* Initialize LLM */
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
}).bindTools(tools);

/* Agent node */
async function callModel(state: { messages: any[] }) {
  const response = await llm.invoke(state.messages);
  return { messages: [...state.messages, response] };
}

/* Routing logic */
function shouldContinue(state: { messages: any[] }) {
  const lastMessage = state.messages[state.messages.length - 1];

  if (
    lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0
  ) {
    return "tools";
  }

  return END;
}

/* Compile graph ONCE */
export const agentGraph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile({ checkpointer });
