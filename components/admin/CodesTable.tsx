import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, TBody, TR, TH, TD, EmptyState } from "@/components/ui/Table";
import { formatDateTime } from "@/lib/format";
import type { CodeRecord } from "@/types";

interface CodesTableProps {
  codes: CodeRecord[];
  showWinner?: boolean;
}

export function CodesTable({ codes, showWinner = false }: CodesTableProps) {
  if (codes.length === 0) {
    return (
      <Table>
        <THead>
          <TH>Codigo</TH>
          <TH>Generado</TH>
          <TH>Estado</TH>
          <TH>Reclamado</TH>
          {showWinner ? <TH>Ganador</TH> : null}
          <TH className="text-right">Acciones</TH>
        </THead>
        <TBody>
          <tr>
            <td colSpan={showWinner ? 6 : 5}>
              <EmptyState>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-ink-700">No hay codigos aun</p>
                  <p className="text-xs text-ink-400">
                    Genera tu primer batch desde la pagina &quot;Generar&quot;.
                  </p>
                </div>
              </EmptyState>
            </td>
          </tr>
        </TBody>
      </Table>
    );
  }

  return (
    <Table>
      <THead>
        <TH>Codigo</TH>
        <TH>Generado</TH>
        <TH>Estado</TH>
        <TH>Reclamado</TH>
        {showWinner ? <TH>Ganador</TH> : null}
        <TH className="text-right">Acciones</TH>
      </THead>
      <TBody>
        {codes.map((c) => (
          <TR key={c.code}>
            <TD className="font-mono text-[13px] font-medium tracking-wider text-ink-900">{c.code}</TD>
            <TD className="text-ink-500">{formatDateTime(c.generatedAt)}</TD>
            <TD>
              {c.claimed ? (
                <Badge tone="success">Reclamado</Badge>
              ) : (
                <Badge tone="neutral">Disponible</Badge>
              )}
            </TD>
            <TD className="text-ink-500">{formatDateTime(c.claimedAt)}</TD>
            {showWinner ? (
              <TD>
                {c.winnerName ? (
                  <div className="flex flex-col leading-tight">
                    <span className="text-ink-900">{c.winnerName}</span>
                    <span className="text-xs text-ink-400">{c.winnerEmail}</span>
                  </div>
                ) : (
                  <span className="text-ink-300">-</span>
                )}
              </TD>
            ) : null}
            <TD className="text-right">
              <Link
                href={`/card/${c.code}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                Ver hologram
                <ArrowUpRight size={12} strokeWidth={2.5} />
              </Link>
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
