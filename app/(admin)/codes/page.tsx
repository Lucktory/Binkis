import Link from "next/link";
import { Topbar } from "@/components/admin/Topbar";
import { CodesTable } from "@/components/admin/CodesTable";
import { ExportButton } from "@/components/admin/ExportButton";
import { Button } from "@/components/ui/Button";
import { getAllCodes } from "@/lib/sheets/codes";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CodesPage() {
  const codes = await getAllCodes();
  const sorted = [...codes].sort((a, b) => (b.generatedAt > a.generatedAt ? 1 : -1));

  return (
    <>
      <Topbar
        title="Codigos"
        description={`${formatNumber(codes.length)} codigos registrados en el sheet`}
        action={
          <>
            <ExportButton scope="all" disabled={codes.length === 0} />
            <Link href="/generate">
              <Button>Generar mas</Button>
            </Link>
          </>
        }
      />
      <div className="p-8">
        <CodesTable codes={sorted} />
      </div>
    </>
  );
}
