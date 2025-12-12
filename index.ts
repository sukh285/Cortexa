import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { MemorySaver } from "@langchain/langgraph";

const checkpointer = new MemorySaver();

//create tool
const tool = new TavilySearch({
  maxResults: 3,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  // includeImages: false,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});

//Array of tools
const tools = [tool];

/* Initialize tool node */
const toolNode = new ToolNode(tools);

/* 
    1. Define node function
    2. Build graph
    3. Compile and invoke graph
*/

/* Initialize LLM */
const llm = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
  // other params...
}).bindTools(tools);

async function callModel(state: { messages: any[] }) {
  //call LLM
  const response = await llm.invoke(state.messages);
  return { messages: [...state.messages, response] }; // accumulate messages
}

function shouldContinue(state: { messages: any[] }) {
  //add conditions to call a tool or end
  const lastMessage = state.messages[state.messages.length - 1];
  if (
    lastMessage &&
    Array.isArray(lastMessage.tool_calls) &&
    lastMessage.tool_calls.length > 0
  ) {
    console.log("Tool called...");
    return "tools";
  }
  return END;
}

/* Build the graph */
const app = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge(START, "agent")
  .addConditionalEdges("agent", shouldContinue)
  .addEdge("tools", "agent")
  .compile({ checkpointer }); //compile and pass checkpointer for memory

//The async fn returns a promise but it doesn't return any meaningful data
async function main(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  //for continuous chat between ai and user

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput === "exit") break;

    /* invoke graph */
    const finalState = await app.invoke(
      {
        messages: [{ role: "user", content: userInput }],
      },
      { configurable: { thread_id: "1" } } //thread id is conversation id (can store in db if we store conversations)
    );

    // update fullMessages from state, if available
    const lastMessage = finalState.messages[finalState.messages.length - 1];
    console.log("Ai:", lastMessage?.content);
  }

  //closes the interface
  rl.close();
}

main();
