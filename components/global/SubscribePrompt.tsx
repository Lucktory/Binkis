"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dialog } from "@/components/ui/Dialog";
import { GoogleSignInButton } from "@/components/global/GoogleSignInButton";
import { markSubscribeSeen, hasSeenSubscribe, SUBSCRIBE_EVENT } from "@/components/global/subscribeBus";

type Stage = "choose" | "manual" | "done";

export function SubscribePrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>("choose");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedName, setCompletedName] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasSeenSubscribe()) {
      const t = setTimeout(() => {
        if (!hasSeenSubscribe()) setOpen(true);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    function onSeen() {
      setOpen(false);
    }
    window.addEventListener(SUBSCRIBE_EVENT, onSeen);
    return () => window.removeEventListener(SUBSCRIBE_EVENT, onSeen);
  }, []);

  function handleClose() {
    markSubscribeSeen();
    setOpen(false);
  }

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch("/api/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authMethod: "google",
            credential,
            path: pathname,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Error con Google Sign-In");
          return;
        }
        setCompletedName(data.name ?? data.email ?? "");
        setStage("done");
        markSubscribeSeen();
        setTimeout(() => setOpen(false), 1600);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error con Google Sign-In");
      } finally {
        setSubmitting(false);
      }
    },
    [pathname]
  );

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authMethod: "manual",
          email,
          path: pathname,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error registrando");
        return;
      }
      setCompletedName(email);
      setStage("done");
      markSubscribeSeen();
      setTimeout(() => setOpen(false), 1600);
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
      description="Te avisamos cuando se lance una nueva edicion limitada."
      className="max-w-sm"
      footer={
        stage === "done" ? (
          <div className="flex items-center justify-end gap-2 text-xs text-status-claimed">
            <CheckCircle2 size={14} strokeWidth={2.5} />
            <span>Listo, te avisaremos pronto</span>
          </div>
        ) : stage === "manual" ? (
          <div className="flex items-center justify-between gap-2">
            <Button variant="ghost" onClick={() => setStage("choose")} disabled={submitting}>
              Volver
            </Button>
            <Button type="submit" form="subscribe-manual-form" loading={submitting}>
              Suscribirme
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={submitting}>
              Ahora no
            </Button>
          </div>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3 rounded-md border border-ink-100 bg-surface-muted px-3 py-2.5">
          <Bell size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-ink-500" />
          <p className="text-xs leading-relaxed text-ink-700">
            Una nueva edicion limitada se lanza pronto. Suscribite con un click.
          </p>
        </div>

        {stage === "choose" ? (
          <div className="flex flex-col gap-3">
            <GoogleSignInButton onCredential={handleGoogleCredential} />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-100" />
              <span className="text-[10px] font-medium uppercase tracking-widest text-ink-400">
                O bien
              </span>
              <div className="h-px flex-1 bg-ink-100" />
            </div>
            <button
              type="button"
              onClick={() => setStage("manual")}
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-surface-muted"
            >
              <Mail size={14} strokeWidth={2.25} />
              Usar mi correo manualmente
            </button>
            {error ? <p className="text-xs text-status-invalid">{error}</p> : null}
          </div>
        ) : null}

        {stage === "manual" ? (
          <form id="subscribe-manual-form" onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <Input
              label="Tu correo"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              error={error ?? undefined}
            />
          </form>
        ) : null}

        {stage === "done" ? (
          <div className="flex flex-col items-center gap-2 rounded-md border border-status-claimed/20 bg-status-claimedBg/40 px-4 py-5 text-center">
            <CheckCircle2 size={28} className="text-status-claimed" strokeWidth={2} />
            <p className="text-sm font-semibold text-ink-900">
              {completedName ? `Gracias, ${completedName.split("@")[0]}` : "Suscripcion registrada"}
            </p>
            <p className="text-xs text-ink-700">Te avisaremos cuando se lance la proxima edicion.</p>
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}
