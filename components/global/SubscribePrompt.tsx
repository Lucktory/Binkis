"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";

const SESSION_KEY = "binkis_subscribe_prompt_v1";

export function SubscribePrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.sessionStorage.getItem(SESSION_KEY);
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      // ignore storage errors (e.g. SSR or restricted env)
    }
  }, []);

  function markSeen() {
    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore
    }
  }

  function handleClose() {
    markSeen();
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, path: pathname }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error registrando");
        return;
      }
      setDone(true);
      markSeen();
      setTimeout(() => setOpen(false), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error registrando");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Recibir novedades de BinKis"
      description="Te avisamos cuando salga una nueva edicion limitada o un sorteo. Tu correo y tu IP se guardan en nuestro registro interno."
      className="max-w-sm"
      footer={
        done ? (
          <div className="flex items-center justify-end gap-2 text-xs text-status-claimed">
            <CheckCircle2 size={14} strokeWidth={2.5} />
            Suscripcion registrada
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>
              Ahora no
            </Button>
            <Button type="submit" form="subscribe-form" loading={submitting}>
              Si, suscribirme
            </Button>
          </div>
        )
      }
    >
      <form id="subscribe-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-md border border-ink-100 bg-surface-muted px-3 py-2.5">
          <Bell size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-ink-500" />
          <p className="text-xs leading-relaxed text-ink-700">
            Quieres recibir un aviso cuando se active una nueva campana de BinKis?
            Si es asi, dejanos tu correo y presiona <strong>Si, suscribirme</strong>.
          </p>
        </div>
        <Input
          label="Tu correo"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting || done}
          error={error ?? undefined}
        />
        <p className="text-[11px] text-ink-400">
          Al continuar autorizas el almacenamiento de tu correo, tu IP y la pagina desde la que te
          suscribiste. Podes pedir su eliminacion en cualquier momento.
        </p>
      </form>
    </Dialog>
  );
}
