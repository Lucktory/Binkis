"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatNumber } from "@/lib/format";

interface GenerateFormProps {
  currentTotal: number;
  minPerBatch?: number;
  maxPerBatch?: number;
  defaultDomain?: string;
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
  domain: string;
}

function sanitizeDomain(input: string): string {
  return input
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
}

export function GenerateForm({
  currentTotal,
  minPerBatch = 100,
  maxPerBatch = 10000,
  defaultDomain = "binkis.xyz",
}: GenerateFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [count, setCount] = useState(10000);
  const [domain, setDomain] = useState(defaultDomain);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LastResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (count < minPerBatch || count > maxPerBatch) {
      setError(`Ingrese un numero entre ${minPerBatch} y ${maxPerBatch}`);
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
        domain: sanitizeDomain(domain),
      });
      toast.success(
        `${formatNumber(data.generated)} codigos generados`,
        `Total acumulado: ${formatNumber(data.totalAfter)}`
      );
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error generando codigos");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadFactoryCsv() {
    setDownloading(true);
    try {
      const cleanDomain = sanitizeDomain(domain);
      const params = new URLSearchParams({ scope: "factory" });
      if (cleanDomain) params.set("domain", cleanDomain);

      const res = await fetch(`/api/codes/export?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error exportando");
      }
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const filename = `binkis-fabrica-${today}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("CSV de fabrica descargado", filename);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error exportando");
    } finally {
      setDownloading(false);
    }
  }

  const presetCounts = [100, 1000, 5000, 10000];
  const canDownloadFactory = currentTotal > 0;

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
              label="Cantidad de codigos"
              type="number"
              inputMode="numeric"
              min={minPerBatch}
              max={maxPerBatch}
              step={100}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              hint={`Entre ${formatNumber(minPerBatch)} y ${formatNumber(maxPerBatch)} por batch.`}
              error={error ?? undefined}
              disabled={isSubmitting || isPending}
            />
            <Input
              label="Dominio para las URLs del QR (opcional)"
              type="text"
              placeholder="binkis.xyz"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              hint="Se incluye en el archivo de fabrica. Si lo dejas vacio, el CSV exporta solo los codigos."
              autoComplete="off"
              disabled={isSubmitting || isPending}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" loading={isSubmitting || isPending}>
                Generar {formatNumber(count)} codigos
              </Button>
              {presetCounts.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="secondary"
                  onClick={() => setCount(preset)}
                  disabled={isSubmitting || isPending}
                >
                  {formatNumber(preset)}
                </Button>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadFactoryCsv}
              loading={downloading}
              disabled={!canDownloadFactory || isSubmitting}
            >
              <Download size={14} strokeWidth={2.5} />
              Descargar CSV para fabrica
            </Button>
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
                      {result.uniqueness.verified ? "Unicidad verificada" : "Anomalia detectada"}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {formatNumber(result.uniqueness.existingBefore)} previos + {formatNumber(result.uniqueness.addedNow)} nuevos = {formatNumber(result.uniqueness.totalAfter)} totales. Duplicados detectados: {result.uniqueness.duplicatesDetected}.
                    </p>
                  </div>
                  <Badge tone={result.uniqueness.verified ? "success" : "danger"}>
                    {result.uniqueness.verified ? "OK" : "Revisar"}
                  </Badge>
                </div>
              ) : null}
              <div className="rounded-md border border-ink-100 bg-surface-muted px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  URL de ejemplo del batch
                </p>
                <p className="mt-1 break-all font-mono text-xs text-ink-700">
                  {result.domain
                    ? `https://${result.domain}/claim?code=${result.codes[0]}`
                    : result.codes[0]}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-xs text-ink-700 sm:grid-cols-3 lg:grid-cols-4">
                {result.codes.slice(0, 60).map((c) => (
                  <span key={c}>{c}</span>
                ))}
                {result.codes.length > 60 ? (
                  <span className="text-ink-400">+{formatNumber(result.codes.length - 60)} mas...</span>
                ) : null}
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
