// src/agent/index.ts
import { agentGraph } from "./graph";

//function runAgent takes 1. message and 2. thread id
export const runAgent = async (
  message: string,
  threadId: string
): Promise<string> => {
  const finalState = await agentGraph.invoke(
    {
      messages: [{ role: "user", content: message }],
    },
    {
      configurable: { thread_id: threadId },
    }
  );

  const lastMessage = finalState.messages[finalState.messages.length - 1];

  let reply = "";

  const content = lastMessage?.content;

  if (typeof content === "string") {
    reply = content;
  } else if (Array.isArray(content)) {
    reply = content
      .filter((c: any) => c.type === "text")
      .map((c: any) => c.text)
      .join("");
  }

  return reply;
};
