import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLogEntry } from "@/lib/sheets/log";
import { extractGeo } from "@/lib/geo";
import { verifyGoogleCredential } from "@/lib/google-auth";

export const dynamic = "force-dynamic";

const bodySchema = z.discriminatedUnion("authMethod", [
  z.object({
    authMethod: z.literal("google"),
    credential: z.string().min(1, "Google credential required"),
    path: z.string().max(500).optional(),
  }),
  z.object({
    authMethod: z.literal("manual"),
    email: z.string().email("Correo invalido").max(200),
    path: z.string().max(500).optional(),
  }),
  z.object({
    authMethod: z.literal("visit"),
    path: z.string().max(500).optional(),
  }),
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  let email = "";
  let name = "";

  if (parsed.data.authMethod === "google") {
    try {
      const profile = await verifyGoogleCredential(parsed.data.credential);
      email = profile.email;
      name = profile.name;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google auth error";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else if (parsed.data.authMethod === "manual") {
    email = parsed.data.email;
  }

  const geo = extractGeo(request);

  try {
    await appendLogEntry({
      email,
      name,
      authMethod: parsed.data.authMethod,
      ip: geo.ip,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      userAgent: request.headers.get("user-agent") ?? "",
      referrer: request.headers.get("referer") ?? "",
      path: parsed.data.path ?? "",
    });
    return NextResponse.json({
      ok: true,
      email,
      name,
      country: geo.country,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
