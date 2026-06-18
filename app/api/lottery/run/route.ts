import { NextResponse } from "next/server";
import { z } from "zod";
import { runLottery } from "@/lib/supabase/codes";
import { isAdminAuthed } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  winnerCount: z.number().int().min(1).max(50000),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthed())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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

  try {
    const result = await runLottery(parsed.data.winnerCount);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
