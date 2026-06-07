"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasSeenSubscribe, markSubscribeSeen } from "@/components/global/subscribeBus";

const SCRIPT_SRC = "https://accounts.google.com/gsi/client";

interface CredentialResponse {
  credential: string;
}

function loadGisScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(s);
  });
}

export function GoogleOneTap() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (hasSeenSubscribe()) return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    let cancelled = false;

    loadGisScript()
      .then(() => {
        if (cancelled) return;
        const gid = window.google?.accounts?.id;
        if (!gid) return;

        gid.initialize({
          client_id: clientId,
          callback: async (response: CredentialResponse) => {
            if (!response.credential) return;
            try {
              await fetch("/api/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  authMethod: "google",
                  credential: response.credential,
                  path: pathname,
                }),
              });
            } catch {
              // ignore network errors silently for One Tap
            } finally {
              markSubscribeSeen();
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        try {
          gid.prompt?.();
        } catch {
          // some browsers / extensions block; that's fine, fallback modal will show
        }
      })
      .catch(() => {
        // silent fail; modal fallback handles it
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
}
