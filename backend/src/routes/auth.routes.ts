import { Hono } from "hono";
import { googleLogin, login } from "../controllers/auth.controllers";

const authRoutes = new Hono();

authRoutes.post("/login", login);
authRoutes.post("/google", googleLogin);

export default authRoutes;
