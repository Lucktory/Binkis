"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "binkis_visit_logged_v1";

export function VisitLogger() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      // storage may be blocked, attempt the log anyway
    }

    const controller = new AbortController();

    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authMethod: "visit",
        path: pathname,
      }),
      signal: controller.signal,
    })
      .then(() => {
        try {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        } catch {
          // ignore
        }
      })
      .catch(() => {
        // silent: never break the page over an analytics call
      });

    return () => controller.abort();
  }, [pathname]);

  return null;
}
