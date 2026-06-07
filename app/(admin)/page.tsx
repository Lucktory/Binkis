import Link from "next/link";
import { Hash, CircleCheck, Activity, TrendingUp, Sparkles } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { MetricCard } from "@/components/admin/MetricCard";
import { CodesTable } from "@/components/admin/CodesTable";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { computeMetrics, getAllCodes } from "@/lib/sheets/codes";
import { formatDateTime, formatNumber, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const codes = await getAllCodes();
  const metrics = computeMetrics(codes);

  const sorted = [...codes].sort((a, b) => (b.generatedAt > a.generatedAt ? 1 : -1));
  const recent = sorted.slice(0, 8);

  return (
    <>
      <Topbar
        title="Resumen"
        description="Estado general del sistema de validacion"
        meta={
          <div className="ml-2 flex items-center gap-2 border-l border-ink-200 pl-4">
            <span className="flex h-1.5 w-1.5 rounded-full bg-status-claimed" />
            <span className="text-xs font-medium text-ink-500">Sheet conectado</span>
          </div>
        }
        action={
          <Link href="/generate">
            <Button>Generar codigos</Button>
          </Link>
        }
      />
      <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Codigos totales"
            value={formatNumber(metrics.totalGenerated)}
            hint="Generados hasta el momento"
            icon={<Hash size={14} strokeWidth={2.25} />}
          />
          <MetricCard
            label="Disponibles"
            value={formatNumber(metrics.totalAvailable)}
            hint="No reclamados aun"
            icon={<Activity size={14} strokeWidth={2.25} />}
          />
          <MetricCard
            label="Reclamados"
            value={formatNumber(metrics.totalClaimed)}
            hint="Ganadores registrados"
            icon={<CircleCheck size={14} strokeWidth={2.25} />}
          />
          <MetricCard
            label="Tasa de reclamo"
            value={formatPercent(metrics.claimRate)}
            hint="Sobre el total generado"
            icon={<TrendingUp size={14} strokeWidth={2.25} />}
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
                    {metrics.latestGeneratedAt
                      ? ` Ultimo: ${formatDateTime(metrics.latestGeneratedAt)}`
                      : ""}
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
              <CodesTable codes={recent} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones rapidas</CardTitle>
              <CardDescription>Operaciones frecuentes del sistema.</CardDescription>
            </CardHeader>
            <CardBody className="flex flex-col gap-3">
              <Link href="/generate">
                <div className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2.5 transition-colors hover:border-ink-200 hover:bg-surface-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-500">
                      <Sparkles size={14} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Generar batch</p>
                      <p className="text-xs text-ink-400">Hasta 100 por click</p>
                    </div>
                  </div>
                  <span className="text-ink-400">&rarr;</span>
                </div>
              </Link>
              <Link href="/verify">
                <div className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2.5 transition-colors hover:border-ink-200 hover:bg-surface-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-500">
                      <CircleCheck size={14} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Verificar codigo</p>
                      <p className="text-xs text-ink-400">Comprobar si es ganador</p>
                    </div>
                  </div>
                  <span className="text-ink-400">&rarr;</span>
                </div>
              </Link>
              <Link href="/winners">
                <div className="flex items-center justify-between rounded-md border border-ink-100 px-3 py-2.5 transition-colors hover:border-ink-200 hover:bg-surface-muted">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-muted text-ink-500">
                      <CircleCheck size={14} strokeWidth={2.25} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">Ver ganadores</p>
                      <p className="text-xs text-ink-400">
                        {metrics.totalClaimed > 0 ? (
                          <>
                            <Badge tone="success" className="mr-1.5">
                              {formatNumber(metrics.totalClaimed)}
                            </Badge>
                            reclamados
                          </>
                        ) : (
                          "Sin reclamos aun"
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-ink-400">&rarr;</span>
                </div>
              </Link>
            </CardBody>
          </Card>
        </section>
      </div>
    </>
  );
}
