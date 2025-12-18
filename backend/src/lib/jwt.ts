import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export type JwtPayload = {
  userId: string;
};

export const sign = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const verify = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
