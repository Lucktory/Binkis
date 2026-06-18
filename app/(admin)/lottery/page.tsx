import { Topbar } from "@/components/admin/Topbar";
import { LotteryPanel } from "@/components/admin/LotteryPanel";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getMetrics } from "@/lib/supabase/codes";
import { formatNumber, formatPercent } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LotteryPage() {
  const metrics = await getMetrics();
  const winnersSelected = metrics.totalWinners > 0;

  return (
    <>
      <Topbar
        breadcrumb="Acciones"
        title="Sorteo de ganadores"
        description="Seleccion aleatoria de los codigos ganadores entre todos los generados. Esta operacion es irreversible."
        meta={
          winnersSelected ? (
            <Badge tone="success">{formatNumber(metrics.totalWinners)} ganadores ya seleccionados</Badge>
          ) : (
            <Badge tone="warning">Sin sorteo ejecutado</Badge>
          )
        }
      />
      <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-3 lg:p-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ejecutar sorteo</CardTitle>
            <CardDescription>
              Marca aleatoriamente N codigos como ganadores. El resto queda como no-ganador
              y al escanear veran &quot;Gracias por jugar&quot;.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <LotteryPanel currentTotal={metrics.totalGenerated} currentWinners={metrics.totalWinners} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado actual</CardTitle>
            <CardDescription>Snapshot al momento de cargar la pagina.</CardDescription>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            <StatRow label="Codigos totales" value={formatNumber(metrics.totalGenerated)} />
            <StatRow label="Ganadores" value={formatNumber(metrics.totalWinners)} />
            <StatRow label="Reclamados" value={formatNumber(metrics.totalClaimed)} />
            <StatRow label="Tasa de reclamo" value={formatPercent(metrics.claimRate)} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-2 last:border-b-0 last:pb-0">
      <span className="text-xs text-ink-500">{label}</span>
      <span className="font-mono text-sm font-semibold text-ink-900">{value}</span>
    </div>
  );
}
