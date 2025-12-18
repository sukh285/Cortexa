import { Hono } from "hono";
import { login } from "../controllers/auth.controllers";

const authRoutes = new Hono();

authRoutes.post("/login", login);

export default authRoutes;
