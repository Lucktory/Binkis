"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ExportButtonProps {
  scope?: "all" | "winners";
  label?: string;
  disabled?: boolean;
}

export function ExportButton({ scope = "all", label = "Exportar a Excel", disabled = false }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch(`/api/codes/export?scope=${scope}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error exportando");
      }
      const blob = await res.blob();
      const today = new Date().toISOString().slice(0, 10);
      const filename = scope === "winners"
        ? `binkis-ganadores-${today}.csv`
        : `binkis-codigos-${today}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error exportando");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="secondary"
      onClick={handleExport}
      loading={loading}
      disabled={disabled}
    >
      {!loading ? <Download size={14} strokeWidth={2.5} /> : null}
      {label}
    </Button>
  );
}
