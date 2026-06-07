import { OAuth2Client } from "google-auth-library";

export interface VerifiedGoogleProfile {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

let cachedClient: OAuth2Client | null = null;

function getClient(): OAuth2Client {
  if (cachedClient) return cachedClient;
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
  }
  cachedClient = new OAuth2Client(clientId);
  return cachedClient;
}

export async function verifyGoogleCredential(idToken: string): Promise<VerifiedGoogleProfile> {
  const client = getClient();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Token payload missing");
  }
  if (!payload.email) {
    throw new Error("Email missing from Google token");
  }
  return {
    email: payload.email,
    name: payload.name ?? "",
    picture: payload.picture ?? "",
    sub: payload.sub ?? "",
  };
}
