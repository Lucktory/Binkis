import { NextResponse } from "next/server";
import { z } from "zod";
import { appendCodes, getAllCodes } from "@/lib/sheets/codes";
import { generateUniqueCodes } from "@/lib/codes/generator";

export const dynamic = "force-dynamic";

const MIN_BATCH_SIZE = 100;
const MAX_BATCH_SIZE = 10000;

const bodySchema = z.object({
  count: z
    .number()
    .int()
    .min(MIN_BATCH_SIZE, `Minimo ${MIN_BATCH_SIZE} codigos por batch`)
    .max(MAX_BATCH_SIZE, `Maximo ${MAX_BATCH_SIZE} codigos por batch`),
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
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  try {
    const existing = await getAllCodes();
    const existingSet = new Set(existing.map((r) => r.code));

    if (existingSet.size !== existing.length) {
      const dupsBefore = existing.length - existingSet.size;
      return NextResponse.json(
        {
          error: `El sheet ya contiene ${dupsBefore} codigo(s) duplicado(s). Revisa los datos antes de generar mas.`,
        },
        { status: 409 }
      );
    }

    const newCodes = generateUniqueCodes(parsed.data.count, existingSet);

    const collisions = newCodes.filter((c) => existingSet.has(c));
    if (collisions.length > 0) {
      return NextResponse.json(
        { error: "Colision detectada antes de escribir. Operacion abortada." },
        { status: 500 }
      );
    }

    await appendCodes(newCodes);

    const verification = await getAllCodes();
    const verifySet = new Set(verification.map((r) => r.code));
    const verificationOk =
      verification.length === existing.length + newCodes.length &&
      verifySet.size === verification.length;

    return NextResponse.json({
      generated: newCodes.length,
      totalAfter: verification.length,
      codes: newCodes,
      uniqueness: {
        verified: verificationOk,
        existingBefore: existing.length,
        addedNow: newCodes.length,
        totalAfter: verification.length,
        duplicatesDetected: verification.length - verifySet.size,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
