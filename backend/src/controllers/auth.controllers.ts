import type { Context } from "hono";
import { db } from "../lib/db";
import { setCookie } from "hono/cookie";
import { sign } from "../lib/jwt";
import { authCookieOptions } from "../lib/cookie";

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { userId } = body;

    if (!userId) return c.json({ error: "userId is required" }, 400);

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return c.json({ error: "User not found" }, 404);

    const token = sign({ userId: user.id });

    setCookie(c, "jwt", token, authCookieOptions);

    return c.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
