import { Topbar } from "@/components/admin/Topbar";
import { CodesTable } from "@/components/admin/CodesTable";
import { ExportButton } from "@/components/admin/ExportButton";
import { getAllCodes } from "@/lib/sheets/codes";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WinnersPage() {
  const codes = await getAllCodes();
  const winners = codes
    .filter((c) => c.claimed)
    .sort((a, b) => ((b.claimedAt ?? "") > (a.claimedAt ?? "") ? 1 : -1));

  return (
    <>
      <Topbar
        title="Ganadores"
        description={`${formatNumber(winners.length)} ganadores han reclamado su premio`}
        action={<ExportButton scope="winners" disabled={winners.length === 0} label="Exportar ganadores" />}
      />
      <div className="p-8">
        <CodesTable codes={winners} showWinner />
      </div>
    </>
  );
}
