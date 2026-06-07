"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { formatNumber } from "@/lib/format";

interface GenerateFormProps {
  currentTotal: number;
  maxPerBatch?: number;
}

interface LastResult {
  generated: number;
  totalAfter: number;
  codes: string[];
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
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-sm text-ink-700 sm:grid-cols-3 lg:grid-cols-4">
              {result.codes.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">
              Una vez que ejecute la generacion, aqui veras los codigos creados en este batch.
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
