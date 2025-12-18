import { Hono } from "hono";

const healthRoutes = new Hono();

healthRoutes.get("/", (c) => {
  return c.json({ status: "ok" });
});

export default healthRoutes;
