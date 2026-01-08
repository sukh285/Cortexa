# Cortexa

Cortexa is a full-stack AI agent system built to understand and implement stateful conversational AI with persistent memory.

## What It Is

A reference implementation for building production-ready AI agents with:
- Stateful conversation management
- Persistent memory across sessions
- Multi-layer reasoning pipelines
- Clean separation of concerns

## Tech Stack

### Backend
![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-E36002?style=for-the-badge&logo=hono&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-121212?style=for-the-badge&logo=chainlink&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## Architecture

### Agent Layer
- LangGraph for agent orchestration
- Tool-enabled LLM nodes
- Conditional routing and retry logic
- In-graph summarization
- Short-term execution memory via checkpointer

### Memory System
Dual-memory architecture:
- **Short-term memory**: LangGraph checkpointer for active conversations
- **Long-term memory**: PostgreSQL for chat summaries and history
- Automatic summarization to manage context window growth
- Memory persists across server restarts

### Data Layer
- PostgreSQL (Neon) for persistence
- Prisma ORM
- Message-level and chat-level storage
- User-isolated data model

## Current Status

**Complete:**
- Full-stack authentication with Google OAuth
- Persistent chat and message storage
- Agent memory that survives restarts
- Automatic conversation summarization
- Modular backend architecture

**Planned:**
- Streaming responses
- Multi-agent coordination
- Expanded tool support

## Key Design Decisions

- **Thread-based identity**: Each conversation maintains its own memory thread
- **Stateless frontend, stateful backend**: All agent state lives server-side
- **Memory compression**: Automatic summarization prevents context overflow
- **User isolation**: Auth-protected, multi-user chat system

## Purpose

This project exists to demonstrate how to build real AI agents with proper state management and memory persistence, beyond simple chat demos.