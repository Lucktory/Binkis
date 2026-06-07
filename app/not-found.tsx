import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-md rounded-lg border border-ink-200 bg-white p-8 shadow-soft text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold text-ink-900">Pagina no encontrada</h1>
        <p className="mt-2 text-sm text-ink-500">
          El enlace que intentaste abrir no existe o el codigo no esta en el sistema.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
