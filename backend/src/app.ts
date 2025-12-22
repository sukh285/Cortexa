import { Hono } from "hono";
import { cors } from "hono/cors";
import healthRoutes from "./routes/health.routes";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (c) => c.text(`Backend running on ${port}`));
app.route("/auth", authRoutes);
app.route("/health", healthRoutes);
app.route("/chat", chatRoutes);

export default {
  port,
  fetch: app.fetch,
};
