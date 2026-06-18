import { cookies } from "next/headers";
import { getServerEnv } from "@/lib/env";

export const ADMIN_COOKIE_NAME = "binkis_admin_auth";

export async function isAdminAuthed(): Promise<boolean> {
  const env = getServerEnv();
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!value) return false;
  return value === env.ADMIN_PASSWORD;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
