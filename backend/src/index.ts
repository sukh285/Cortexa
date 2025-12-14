import { Hono } from "hono";

const app = new Hono();
const port = Number(process.env.PORT) || 3000;

app.get("/", (c) => c.text(`Backend running on ${port}`));
app.get("/health", (c) => c.json({ status: "ok" }));


export default {
  port,
  fetch: app.fetch,
};