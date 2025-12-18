import type { Context } from "hono"
import { runAgent } from "../agent/agent"

export const getAllChats = async (c: Context) => {}


export const sendMsg = async (c : Context) => {
    const chatId = c.req.param("chatId");

    const body = await c.req.json();
    const message = body.message;

    if(!message){
        return c.json({error: "Message required"}, 400);
    }

    const reply = await runAgent(message, chatId);

    return c.json({chatId, reply});
}


export const getChat = async (c: Context) => {
    const chatId = c.req.param("chatId");

    return c.json({
        chatId,
        messages: [],
        note: "Chat history on Db addition"
    })
}


export const deleteChat = async (c: Context) => {}