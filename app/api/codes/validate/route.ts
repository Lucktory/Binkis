import { NextResponse } from "next/server";
import { findCode } from "@/lib/supabase/codes";
import { isValidCodeFormat } from "@/lib/codes/generator";
import type { ValidationResult } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim() ?? "";

  if (!code || !isValidCodeFormat(code)) {
    const result: ValidationResult = { state: "invalid", code };
    return NextResponse.json(result);
  }

  try {
    const record = await findCode(code);
    if (!record || !record.isWinner) {
      const result: ValidationResult = { state: "invalid", code };
      return NextResponse.json(result);
    }
    if (record.claimed) {
      const result: ValidationResult = {
        state: "claimed",
        code,
        claimedAt: record.claimedAt,
      };
      return NextResponse.json(result);
    }
    const result: ValidationResult = { state: "valid", code };
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
