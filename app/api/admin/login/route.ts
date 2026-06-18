import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, adminCookieOptions } from "@/lib/admin-auth";
import { getServerEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password requerido" }, { status: 400 });
  }
  const env = getServerEnv();
  if (parsed.data.password !== env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Password incorrecto" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, env.ADMIN_PASSWORD, adminCookieOptions());
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, "", { ...adminCookieOptions(), maxAge: 0 });
  return res;
}
