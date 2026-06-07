import Link from "next/link";
import { Hash, CircleCheck, Activity, TrendingUp, Sparkles, ShieldCheck, Trophy } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { MetricCard } from "@/components/admin/MetricCard";
import { CodesTable } from "@/components/admin/CodesTable";
import { InsightsCard } from "@/components/admin/InsightsCard";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { buildDailySeries, computeMetrics, getAllCodes } from "@/lib/sheets/codes";
import { formatDateTime, formatNumber, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const codes = await getAllCodes();
  const metrics = computeMetrics(codes);
  const series = buildDailySeries(codes, 7);
  const recentDeltaPct = (() => {
    const last = series.generated[series.generated.length - 1] ?? 0;
    const prev = series.generated.slice(0, -1).reduce((a, b) => a + b, 0) / Math.max(1, series.generated.length - 1);
    if (prev === 0) return last > 0 ? "100%" : "0%";
    const pct = ((last - prev) / prev) * 100;
    return `${pct >= 0 ? "+" : ""}${pct.toFixed(0)}%`;
  })();

  const sorted = [...codes].sort((a, b) => (b.generatedAt > a.generatedAt ? 1 : -1));
  const recent = sorted.slice(0, 8);

  return (
    <>
      <Topbar
        breadcrumb="Dashboard"
        title="Resumen"
        description="Estado general del sistema de validacion. Las metricas se actualizan al recargar."
        meta={
          <>
            <Badge tone="success">Sheet conectado</Badge>
            {metrics.latestGeneratedAt ? (
              <span className="text-xs text-ink-400">
                Ultima generacion: {formatDateTime(metrics.latestGeneratedAt)}
              </span>
            ) : null}
          </>
        }
        action={
          <Link href="/generate">
            <Button>Generar codigos</Button>
          </Link>
        }
      />
      <div className="flex flex-col gap-6 p-4 animate-fadeUp sm:p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Codigos totales"
            value={formatNumber(metrics.totalGenerated)}
            hint="Generados hasta el momento"
            icon={<Hash size={14} strokeWidth={2.25} />}
            sparkline={series.cumulative}
            delta={{
              value: recentDeltaPct,
              direction: recentDeltaPct.startsWith("-")
                ? "down"
                : recentDeltaPct === "0%"
                ? "flat"
                : "up",
            }}
          />
          <MetricCard
            label="Disponibles"
            value={formatNumber(metrics.totalAvailable)}
            hint="No reclamados aun"
            icon={<Activity size={14} strokeWidth={2.25} />}
            progress={metrics.totalGenerated === 0 ? 0 : metrics.totalAvailable / metrics.totalGenerated}
          />
          <MetricCard
            label="Reclamados"
            value={formatNumber(metrics.totalClaimed)}
            hint="Ganadores registrados"
            icon={<CircleCheck size={14} strokeWidth={2.25} />}
            sparkline={series.claimed}
          />
          <MetricCard
            label="Tasa de reclamo"
            value={formatPercent(metrics.claimRate)}
            hint="Sobre el total generado"
            icon={<TrendingUp size={14} strokeWidth={2.25} />}
            donut={metrics.claimRate}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Codigos recientes</CardTitle>
                  <CardDescription>
                    Ultimos 8 codigos agregados al sheet.
                  </CardDescription>
                </div>
                <Link
                  href="/codes"
                  className="shrink-0 text-sm font-medium text-accent hover:underline"
                >
                  Ver todos
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <CodesTable codes={recent} paginated={false} />
            </CardBody>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Acciones rapidas</CardTitle>
                <CardDescription>Operaciones frecuentes.</CardDescription>
              </CardHeader>
              <CardBody className="flex flex-col gap-2">
                <ActionRow href="/generate" icon={Sparkles} label="Generar batch" subtitle="Hasta 100 por click" />
                <ActionRow href="/verify" icon={ShieldCheck} label="Verificar codigo" subtitle="Comprobar si es ganador" />
                <ActionRow
                  href="/winners"
                  icon={Trophy}
                  label="Ver ganadores"
                  subtitle={metrics.totalClaimed > 0 ? `${formatNumber(metrics.totalClaimed)} reclamados` : "Sin reclamos aun"}
                />
              </CardBody>
            </Card>

            <InsightsCard records={codes} />
          </div>
        </section>
      </div>
    </>
  );
}

function ActionRow({
  href,
  icon: Icon,
  label,
  subtitle,
}: {
  href: string;
  icon: typeof Hash;
  label: string;
  subtitle: string;
}) {
  return (
    <Link href={href}>
      <div className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2.5 transition-all hover:border-ink-200 hover:bg-surface-muted">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-muted text-ink-500">
            <Icon size={14} strokeWidth={2.25} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-900">{label}</p>
            <p className="text-xs text-ink-400">{subtitle}</p>
          </div>
        </div>
        <span className="text-ink-400">&rarr;</span>
      </div>
    </Link>
  );
}
