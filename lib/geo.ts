export interface GeoInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
}

function safeDecode(value: string | null): string {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function extractGeo(request: Request): GeoInfo {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipFromForwarded = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const ip =
    ipFromForwarded ||
    request.headers.get("x-real-ip") ||
    "unknown";

  return {
    ip,
    country: safeDecode(request.headers.get("x-vercel-ip-country")) || "unknown",
    region: safeDecode(request.headers.get("x-vercel-ip-country-region")) || "unknown",
    city: safeDecode(request.headers.get("x-vercel-ip-city")) || "unknown",
  };
}
