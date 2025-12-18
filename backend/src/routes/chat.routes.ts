import { Hono } from "hono";
import {
  sendMsg,
  getAllChats,
  getChat,
  deleteChat,
} from "../controllers/chat.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const chatRoutes = new Hono();

chatRoutes.use("*", authMiddleware);

chatRoutes.get("/", getAllChats);
chatRoutes.post("/:chatId", sendMsg);
chatRoutes.get("/:chatId", getChat);
chatRoutes.delete("/:chatId", deleteChat);

export default chatRoutes;
