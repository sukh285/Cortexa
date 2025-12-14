import { runAgent } from "./agent";

async function test() {
  const reply = await runAgent(
    "What is LangGraph in simple words?",
    "test-thread-1"
  );

  console.log("Agent reply:", reply);
}

test();
