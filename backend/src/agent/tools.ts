// src/agent/tools.ts
import { TavilySearch } from "@langchain/tavily";

export const tools = [
  new TavilySearch({
    maxResults: 3,
    topic: "general",
  }),
];
