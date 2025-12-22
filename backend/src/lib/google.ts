import { OAuth2Client } from "google-auth-library";

export const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.FRONTEND_URL // redirect URI
);

export type GoogleUserPayload = {
  providerId: string;
  email: string;
  name?: string;
  picture?: string;
};

export const verifyGoogleToken = async (
  idToken: string
): Promise<GoogleUserPayload> => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if(!payload){
    throw new Error("Invalid Google token payload");
  }

  return {
    providerId: payload.sub!,
    email: payload.email!,
    name: payload.name,
    picture: payload.picture
  }
};
