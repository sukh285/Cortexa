import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "../lib/jwt";
import { db } from "../lib/db";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // 1. Read JWT from cookie
    const token = getCookie(c, "jwt");

    if (!token) {
      return c.json({ error: "Unauthorized - no token" }, 401);
    }

    // 2. Verify JWT
    let payload;
    try {
      payload = verify(token);
    } catch {
      return c.json({ error: "Unauthorized - invalid token" }, 401);
    }

    // 3. Fetch user
    const user = await db.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    // 4. Attach user to context
    c.set("user", user);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 500);
  }
};
