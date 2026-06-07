import Link from "next/link";
import { Hash, CircleCheck, Activity, Clock } from "lucide-react";
import { Topbar } from "@/components/admin/Topbar";
import { MetricCard } from "@/components/admin/MetricCard";
import { CodesTable } from "@/components/admin/CodesTable";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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
        action={
          <Link href="/generate">
            <Button>Generar codigos</Button>
          </Link>
        }
      />
      <div className="flex flex-col gap-6 p-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            label="Codigos totales"
            value={formatNumber(metrics.totalGenerated)}
            hint="Generados hasta el momento"
            icon={<Hash size={16} />}
          />
          <MetricCard
            label="Disponibles"
            value={formatNumber(metrics.totalAvailable)}
            hint="No reclamados aun"
            icon={<Activity size={16} />}
          />
          <MetricCard
            label="Reclamados"
            value={formatNumber(metrics.totalClaimed)}
            hint="Ganadores ya registrados"
            icon={<CircleCheck size={16} />}
          />
          <MetricCard
            label="Tasa de reclamo"
            value={formatPercent(metrics.claimRate)}
            hint="Sobre el total generado"
            icon={<Clock size={16} />}
          />
        </section>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Codigos recientes</CardTitle>
                <CardDescription>
                  Ultimos 8 codigos agregados al sheet.
                  {metrics.latestGeneratedAt
                    ? ` Ultimo: ${formatDateTime(metrics.latestGeneratedAt)}`
                    : ""}
                </CardDescription>
              </div>
              <Link href="/codes" className="text-sm font-medium text-accent hover:underline">
                Ver todos
              </Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <CodesTable codes={recent} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
