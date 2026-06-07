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

let regionNames: Intl.DisplayNames | null = null;

function getRegionNames(): Intl.DisplayNames {
  if (!regionNames) {
    regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  }
  return regionNames;
}

function isoToCountryName(iso: string): string {
  if (!iso || iso === "unknown") return "Unknown";
  const code = iso.toUpperCase();
  if (code.length !== 2) return iso;
  try {
    const name = getRegionNames().of(code);
    return name && name !== code ? name : iso;
  } catch {
    return iso;
  }
}

function isoToRegionName(country: string, region: string): string {
  if (!region || region === "unknown") return "Unknown";
  if (!country || country === "unknown") return region;
  const combined = `${country.toUpperCase()}-${region.toUpperCase()}`;
  try {
    const name = getRegionNames().of(combined);
    if (name && name !== combined) return name;
  } catch {
    // fall through
  }
  return region;
}

export function extractGeo(request: Request): GeoInfo {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipFromForwarded = forwarded ? forwarded.split(",")[0]?.trim() : null;
  const ip =
    ipFromForwarded ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const rawCountry = safeDecode(request.headers.get("x-vercel-ip-country"));
  const rawRegion = safeDecode(request.headers.get("x-vercel-ip-country-region"));
  const rawCity = safeDecode(request.headers.get("x-vercel-ip-city"));

  return {
    ip,
    country: isoToCountryName(rawCountry || "unknown"),
    region: isoToRegionName(rawCountry, rawRegion || "unknown"),
    city: rawCity || "Unknown",
  };
}
