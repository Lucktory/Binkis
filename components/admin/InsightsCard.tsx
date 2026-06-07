import { Clock, MapPin, Hourglass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import type { CodeRecord } from "@/types";

interface InsightsCardProps {
  records: CodeRecord[];
}

function computeAverageTimeToClaim(records: CodeRecord[]): string {
  const claimed = records.filter((r) => r.claimed && r.claimedAt && r.generatedAt);
  if (claimed.length === 0) return "-";
  const totalMs = claimed.reduce((acc, r) => {
    const g = Date.parse(r.generatedAt);
    const c = Date.parse(r.claimedAt as string);
    if (Number.isNaN(g) || Number.isNaN(c)) return acc;
    return acc + (c - g);
  }, 0);
  const avgMs = totalMs / claimed.length;
  if (avgMs < 60 * 1000) return `${Math.round(avgMs / 1000)}s`;
  if (avgMs < 60 * 60 * 1000) return `${Math.round(avgMs / (60 * 1000))}m`;
  if (avgMs < 24 * 60 * 60 * 1000) return `${Math.round(avgMs / (60 * 60 * 1000))}h`;
  return `${Math.round(avgMs / (24 * 60 * 60 * 1000))}d`;
}

function computePeakHour(records: CodeRecord[]): string {
  const claimedDates = records
    .filter((r) => r.claimed && r.claimedAt)
    .map((r) => new Date(r.claimedAt as string));
  if (claimedDates.length === 0) return "-";
  const buckets = new Array(24).fill(0) as number[];
  for (const d of claimedDates) {
    if (!Number.isNaN(d.getTime())) buckets[d.getHours()] += 1;
  }
  let bestHour = 0;
  let bestCount = 0;
  for (let h = 0; h < 24; h += 1) {
    if (buckets[h] > bestCount) {
      bestHour = h;
      bestCount = buckets[h];
    }
  }
  if (bestCount === 0) return "-";
  return `${bestHour.toString().padStart(2, "0")}:00`;
}

export function InsightsCard({ records }: InsightsCardProps) {
  const avgTime = computeAverageTimeToClaim(records);
  const peakHour = computePeakHour(records);
  const totalClaimed = records.filter((r) => r.claimed).length;

  const insights = [
    {
      icon: Hourglass,
      label: "Tiempo promedio al reclamo",
      value: avgTime,
      hint: totalClaimed === 0 ? "Necesita al menos 1 reclamo" : "Desde generacion a primer reclamo",
    },
    {
      icon: Clock,
      label: "Hora pico de reclamo",
      value: peakHour,
      hint: totalClaimed === 0 ? "Sin datos aun" : `Basado en ${totalClaimed} reclamo${totalClaimed === 1 ? "" : "s"}`,
    },
    {
      icon: MapPin,
      label: "Pais mas comun",
      value: "Mexico",
      hint: "Datos de visitas (LOG sheet)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights</CardTitle>
        <CardDescription>Patrones detectados en los datos actuales.</CardDescription>
      </CardHeader>
      <CardBody className="flex flex-col gap-2.5">
        {insights.map((i) => {
          const Icon = i.icon;
          return (
            <div
              key={i.label}
              className="flex items-center gap-3 rounded-md border border-ink-100 bg-surface-base/60 px-3 py-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-soft text-amber">
                <Icon size={14} strokeWidth={2} />
              </span>
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                  {i.label}
                </span>
                <span className="text-sm font-semibold tabular-nums text-ink-900">{i.value}</span>
              </div>
              <span className="hidden text-[11px] text-ink-400 sm:block">{i.hint}</span>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
