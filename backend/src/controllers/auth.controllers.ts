import type { Context } from "hono";
import { db } from "../lib/db";
import { setCookie } from "hono/cookie";
import { sign } from "../lib/jwt";
import { authCookieOptions } from "../lib/cookie";
import { verifyGoogleToken } from "../lib/google";

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

export const googleLogin = async (c: Context) => {
  try {
    // 1. Read id token from body
    const body = await c.req.json();
    const { idToken } = body;

    if (!idToken) {
      return c.json({ error: "idToken is required" }, 400);
    }

    // 2. Verify Google Id Token
    const googleUser = await verifyGoogleToken(idToken);

    // 3. Find user
    let user = await db.user.findUnique({
      where: {
        providerId: googleUser.providerId,
      },
    });

    // 4. Create user if not exist
    if (!user) {
      user = await db.user.create({
        data: {
          email: googleUser.email,
          username: googleUser.name,
          profileImage: googleUser.picture,
          authProvider: "GOOGLE",
          providerId: googleUser.providerId,
        },
      });
    }

    // 5. Sign our own JWT
    const token = sign({ userId: user.id });

    // 6. Set JWT Cookie
    setCookie(c, "jwt", token, authCookieOptions);

    // 7. Response
    return c.json({
      message: "Login Successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};
