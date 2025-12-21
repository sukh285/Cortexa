import { Hono } from "hono";
import { googleLogin, logout, me } from "../controllers/auth.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const authRoutes = new Hono();

authRoutes.post("/google", googleLogin);
authRoutes.get("/me", authMiddleware, me);
authRoutes.post("/logout", logout);

export default authRoutes;
