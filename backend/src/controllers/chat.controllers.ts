import type { Context } from "hono";
import { runAgent } from "../agent/agent";
import { db } from "../lib/db";

export const getAllChats = async (c: Context) => {
  try {
    const user = c.get("user");

    const chats = await db.chat.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json({ chats });
  } catch (error) {
    console.error("getAllChats error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const sendMsg = async (c: Context) => {
  try {
    const user = c.get("user");
    let chatId = c.req.param("chatId");

    // 1. Create or validate chat
    if (chatId) {
      const chat = await db.chat.findFirst({
        where: { id: chatId, userId: user.id },
      });

      if (!chat) {
        return c.json({ error: "Chat not found" }, 404);
      }
    } else {
      const chat = await db.chat.create({
        data: { userId: user.id },
      });
      chatId = chat.id;
    }

    // 2. Read & validate message
    const body = await c.req.json();
    const message = body.message?.trim();

    if (!message) {
      return c.json({ error: "Message required" }, 400);
    }

    // 3. Store user message
    await db.message.create({
      data: {
        chatId,
        role: "USER",
        content: message,
      },
    });

    // 4. Run agent
    const reply = await runAgent(message, chatId);

    // 5. Store assistant reply
    await db.message.create({
      data: {
        chatId,
        role: "ASSISTANT",
        content: reply,
      },
    });

    // 6. Respond
    return c.json({ chatId, reply });
  } catch (error) {
    console.error("sendMsg error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};


export const getChat = async (c: Context) => {
  try {
    const chatId = c.req.param("chatId");
    const user = c.get("user");

    // 1. Verify chat ownership
    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }

    // 2. Fetch messages
    const messages = await db.message.findMany({
      where: {
        chatId,
      },
      orderBy: { createdAt: "asc" },
      select: {
        role: true,
        content: true,
        createdAt: true,
      },
    });

    return c.json({
      chatId,
      messages,
    });
  } catch (error) {
    console.error("getChat error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};

export const deleteChat = async (c: Context) => {
  try {
    const chatId = c.req.param("chatId");
    const user = c.get("user");

    const chat = await db.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
    });

    if (!chat) {
      return c.json({ error: "Chat not found" }, 404);
    }

    //delete all messages of the chat
    await db.message.deleteMany({
      where: {
        chatId,
      },
    });

    //delete the chat
    await db.chat.delete({
      where: {
        id: chatId,
      },
    });

    return c.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("deleteChat error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
