const isProd = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
} as const;
