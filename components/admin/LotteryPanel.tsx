"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Dices, ShieldCheck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatNumber } from "@/lib/format";

interface LotteryPanelProps {
  currentTotal: number;
  currentWinners: number;
}

interface LotteryResult {
  selected: number;
  alreadyWinners: number;
  remainingAvailable: number;
}

export function LotteryPanel({ currentTotal, currentWinners }: LotteryPanelProps) {
  const router = useRouter();
  const toast = useToast();
  const [winnerCount, setWinnerCount] = useState(4000);
  const [confirming, setConfirming] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<LotteryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function executeLottery() {
    setError(null);
    setRunning(true);
    try {
      const res = await fetch("/api/lottery/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerCount }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error en sorteo");
        toast.error(data.error ?? "Error en sorteo");
        return;
      }
      setResult({
        selected: data.selected,
        alreadyWinners: data.alreadyWinners,
        remainingAvailable: data.remainingAvailable,
      });
      toast.success(
        `Sorteo ejecutado: ${formatNumber(data.selected)} ganadores nuevos`,
        `Ya habia ${formatNumber(data.alreadyWinners)} ganadores antes`
      );
      startTransition(() => router.refresh());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error en sorteo";
      setError(message);
      toast.error(message);
    } finally {
      setRunning(false);
      setConfirming(false);
    }
  }

  const noCodes = currentTotal === 0;
  const enoughCodes = currentTotal >= winnerCount;
  const winnersExist = currentWinners > 0;

  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Cantidad de ganadores a seleccionar"
        type="number"
        inputMode="numeric"
        min={1}
        max={Math.max(currentTotal, 50000)}
        step={100}
        value={winnerCount}
        onChange={(e) => setWinnerCount(Number(e.target.value))}
        hint={`Hay ${formatNumber(currentTotal)} codigos en la base. ${formatNumber(currentWinners)} ya marcados como ganadores.`}
        disabled={running}
      />

      {noCodes ? (
        <div className="flex items-start gap-3 rounded-md border border-status-invalid/20 bg-status-invalidBg/60 px-3.5 py-3 text-xs text-ink-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-status-invalid" strokeWidth={2} />
          <div>
            <p className="font-semibold text-ink-900">No hay codigos en la base</p>
            <p className="mt-0.5">Generar codigos primero desde &quot;Generar&quot;.</p>
          </div>
        </div>
      ) : null}

      {!noCodes && !enoughCodes ? (
        <div className="flex items-start gap-3 rounded-md border border-status-invalid/20 bg-status-invalidBg/60 px-3.5 py-3 text-xs text-ink-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-status-invalid" strokeWidth={2} />
          <div>
            <p className="font-semibold text-ink-900">No hay suficientes codigos</p>
            <p className="mt-0.5">
              Pediste {formatNumber(winnerCount)} ganadores pero solo hay {formatNumber(currentTotal)} codigos.
            </p>
          </div>
        </div>
      ) : null}

      {winnersExist && !confirming ? (
        <div className="flex items-start gap-3 rounded-md border border-amber-ring/30 bg-amber-soft px-3.5 py-3 text-xs text-ink-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber" strokeWidth={2} />
          <div>
            <p className="font-semibold text-ink-900">Ya hay un sorteo ejecutado</p>
            <p className="mt-0.5">
              {formatNumber(currentWinners)} codigos ya estan marcados como ganadores. Si ejecutas de nuevo, el sistema completa
              hasta llegar al numero pedido (no resetea).
            </p>
          </div>
        </div>
      ) : null}

      {!confirming ? (
        <Button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={noCodes || !enoughCodes || running}
          size="lg"
        >
          <Dices size={16} strokeWidth={2.25} />
          Preparar sorteo de {formatNumber(winnerCount)} ganadores
        </Button>
      ) : (
        <div className="flex flex-col gap-3 rounded-md border border-amber-ring/30 bg-amber-soft px-4 py-4">
          <div className="flex items-start gap-3 text-xs text-ink-700">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber" strokeWidth={2} />
            <div>
              <p className="font-semibold text-ink-900">Confirmar sorteo</p>
              <p className="mt-1">
                Se van a marcar aleatoriamente {formatNumber(winnerCount)} codigos como ganadores. Esta accion no
                se puede deshacer facilmente. Estas seguro?
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={executeLottery} loading={running} variant="danger">
              Si, ejecutar sorteo
            </Button>
            <Button type="button" variant="ghost" onClick={() => setConfirming(false)} disabled={running}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {error ? <p className="text-xs text-status-invalid">{error}</p> : null}

      {result ? (
        <div className="flex flex-col gap-2 rounded-md border border-status-claimed/20 bg-status-claimedBg/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-status-claimed" strokeWidth={2.5} />
            <p className="text-sm font-semibold text-ink-900">Sorteo completado</p>
          </div>
          <p className="text-xs text-ink-700">
            {formatNumber(result.selected)} codigos nuevos marcados como ganadores. Ya habia{" "}
            {formatNumber(result.alreadyWinners)} ganadores previos. Quedan{" "}
            {formatNumber(result.remainingAvailable)} codigos sin ganar disponibles para futuros sorteos.
          </p>
        </div>
      ) : null}
    </div>
  );
}
