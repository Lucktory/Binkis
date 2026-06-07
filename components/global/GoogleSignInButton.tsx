"use client";

import { useEffect, useRef, useState } from "react";

interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void;
  width?: number;
}

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({ onCredential, width = 320 }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unconfigured, setUnconfigured] = useState(false);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setUnconfigured(true);
      return;
    }

    let cancelled = false;

    loadGisScript()
      .then(() => {
        if (cancelled) return;
        if (!window.google?.accounts?.id || !containerRef.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) onCredential(response.credential);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "left",
          width,
          locale: "es",
        });
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [onCredential, width]);

  if (unconfigured) {
    return (
      <div className="rounded-md border border-ink-200 bg-surface-muted px-3 py-2 text-xs text-ink-500">
        Google Sign-In no esta configurado. Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div ref={containerRef} className="flex justify-center" />
      {error ? (
        <p className="text-xs text-status-invalid">{error}</p>
      ) : null}
    </div>
  );
}
