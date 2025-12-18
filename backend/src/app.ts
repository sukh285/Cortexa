import { Hono } from "hono";
import healthRoutes from "./routes/health.routes";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => c.text(`Backend running on ${port}`));
app.route("/auth", authRoutes);
app.route("/health", healthRoutes);
app.route("/chat", chatRoutes);

export default {
  port,
  fetch: app.fetch,
};
