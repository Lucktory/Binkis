import { randomBytes } from "crypto";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SEGMENT_LENGTH = 4;
const SEGMENTS = 2;
const PREFIX = "BNK";

function randomSegment(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

export function generateCode(): string {
  const segments: string[] = [PREFIX];
  for (let i = 0; i < SEGMENTS; i += 1) {
    segments.push(randomSegment(SEGMENT_LENGTH));
  }
  return segments.join("-");
}

export function generateUniqueCodes(count: number, existing: Set<string>): string[] {
  const created = new Set<string>();
  let attempts = 0;
  const maxAttempts = count * 50;

  while (created.size < count) {
    if (attempts >= maxAttempts) {
      throw new Error(
        `Unable to generate ${count} unique codes after ${attempts} attempts. Pool may be exhausted.`
      );
    }
    const code = generateCode();
    if (!existing.has(code) && !created.has(code)) {
      created.add(code);
    }
    attempts += 1;
  }

  return Array.from(created);
}

export function isValidCodeFormat(code: string): boolean {
  const pattern = new RegExp(
    `^${PREFIX}-[${CODE_ALPHABET}]{${SEGMENT_LENGTH}}-[${CODE_ALPHABET}]{${SEGMENT_LENGTH}}$`
  );
  return pattern.test(code);
}
