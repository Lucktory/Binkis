import Link from "next/link";
import { notFound } from "next/navigation";
import { HologramCard } from "@/components/public/HologramCard";
import { Button } from "@/components/ui/Button";
import { isValidCodeFormat } from "@/lib/codes/generator";
import { findCode } from "@/lib/sheets/codes";
import { publicEnv } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const { code } = await params;

  if (!isValidCodeFormat(code)) {
    notFound();
  }

  const record = await findCode(code);
  if (!record) {
    notFound();
  }

  const validationUrl = `${publicEnv.NEXT_PUBLIC_BASE_URL}/v/${code}`;

  return (
    <div className="min-h-screen bg-surface-base">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/codes" className="text-sm font-medium text-ink-500 hover:text-ink-900">
            &larr; Volver a codigos
          </Link>
          <Link href={`/v/${code}`}>
            <Button variant="secondary" size="sm">
              Simular escaneo
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Vista previa del hologram</p>
          <h1 className="mt-1 text-2xl font-semibold text-ink-900">Codigo asignado: {code}</h1>
          <p className="mt-2 text-sm text-ink-500">
            Asi se ve la pieza fisica que llega al ganador. El QR de la derecha es real y escaneable
            con cualquier celular. Apuntalo y abrira la pagina de validacion del codigo.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Estado actual</p>
              <p className="mt-2 text-sm text-ink-700">
                {record.claimed
                  ? "Este codigo ya fue reclamado"
                  : "Disponible para reclamar"}
              </p>
            </div>
            <div className="rounded-lg border border-ink-200 bg-white p-4 shadow-card">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-500">URL del QR</p>
              <p className="mt-2 break-all font-mono text-xs text-ink-700">{validationUrl}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link href={`/v/${code}`}>
              <Button>Probar la validacion</Button>
            </Link>
            <Link href="/generate">
              <Button variant="secondary">Generar mas codigos</Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 lg:max-w-md">
          <HologramCard
            code={code}
            validationUrl={validationUrl}
            brandName={publicEnv.NEXT_PUBLIC_BRAND_NAME}
            collectionNumber={publicEnv.NEXT_PUBLIC_COLLECTION_NUMBER}
          />
        </div>
      </main>
    </div>
  );
}
