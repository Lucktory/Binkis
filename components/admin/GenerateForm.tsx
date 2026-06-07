"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/format";

interface GenerateFormProps {
  currentTotal: number;
  maxPerBatch?: number;
}

interface UniquenessReport {
  verified: boolean;
  existingBefore: number;
  addedNow: number;
  totalAfter: number;
  duplicatesDetected: number;
}

interface LastResult {
  generated: number;
  totalAfter: number;
  codes: string[];
  uniqueness?: UniquenessReport;
}

export function GenerateForm({ currentTotal, maxPerBatch = 100 }: GenerateFormProps) {
  const router = useRouter();
  const [count, setCount] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LastResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (count < 1 || count > maxPerBatch) {
      setError(`Ingrese un numero entre 1 y ${maxPerBatch}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/codes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error generando codigos");
        return;
      }
      setResult({
        generated: data.generated,
        totalAfter: data.totalAfter,
        codes: data.codes,
        uniqueness: data.uniqueness,
      });
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando codigos");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generar nuevo batch</CardTitle>
          <CardDescription>
            Los codigos se agregan al sheet existente. Total actual: {formatNumber(currentTotal)}
          </CardDescription>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Cantidad por batch"
              type="number"
              min={1}
              max={maxPerBatch}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              hint={`Maximo ${maxPerBatch} por click. Default sugerido: 50`}
              error={error ?? undefined}
              disabled={isSubmitting || isPending}
            />
            <div className="flex gap-2">
              <Button type="submit" loading={isSubmitting || isPending}>
                Generar {formatNumber(count)} codigos
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCount(10)}
                disabled={isSubmitting || isPending}
              >
                10
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCount(50)}
                disabled={isSubmitting || isPending}
              >
                50
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCount(maxPerBatch)}
                disabled={isSubmitting || isPending}
              >
                {maxPerBatch}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Ultimo batch generado</CardTitle>
          <CardDescription>
            {result
              ? `${formatNumber(result.generated)} codigos. Total ahora: ${formatNumber(result.totalAfter)}`
              : "Aun no se ha generado ningun batch en esta sesion."}
          </CardDescription>
        </CardHeader>
        <CardBody>
          {result ? (
            <div className="flex flex-col gap-4">
              {result.uniqueness ? (
                <div
                  className={
                    result.uniqueness.verified
                      ? "flex items-center gap-3 rounded-md border border-status-claimed/20 bg-status-claimedBg/40 px-4 py-2.5"
                      : "flex items-center gap-3 rounded-md border border-status-invalid/20 bg-status-invalidBg/60 px-4 py-2.5"
                  }
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={2.5}
                    className={result.uniqueness.verified ? "text-status-claimed" : "text-status-invalid"}
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs font-semibold text-ink-900">
                      {result.uniqueness.verified
                        ? "Unicidad verificada"
                        : "Anomalia detectada"}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {result.uniqueness.existingBefore} previos + {result.uniqueness.addedNow} nuevos = {result.uniqueness.totalAfter} totales.
                      Duplicados detectados: {result.uniqueness.duplicatesDetected}.
                    </p>
                  </div>
                  <Badge tone={result.uniqueness.verified ? "success" : "danger"}>
                    {result.uniqueness.verified ? "OK" : "Revisar"}
                  </Badge>
                </div>
              ) : null}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm text-ink-700 sm:grid-cols-3 lg:grid-cols-4">
                {result.codes.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-400">
              Una vez que ejecute la generacion, aqui veras los codigos creados en este batch
              junto con la verificacion de unicidad contra el sheet.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
