import type { Context } from "hono";
import { db } from "../lib/db";
import { setCookie } from "hono/cookie";
import { sign } from "../lib/jwt";
import { authCookieOptions } from "../lib/cookie";
import { verifyGoogleToken } from "../lib/google";

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
    console.log("Google Login success:", user);
    
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

export const me = async (c: Context) => {
  const user = c.get("user");

  if(!user){
    return c.json({
      message: "User not found"
    }, 404);
  }
  
  return c.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
};

export const logout = async (c: Context) => {
  try {
    // Delete the jwt cookie
    setCookie(c, "jwt", "", {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
      path: "/",
      maxAge: 0
    })


    return c.json({message: "User logout successfully"});
  } catch (error) {
    console.error("Logout error:", error);
    return c.json({message: "Error logging out"}, 500);
  }
}
