import { Topbar } from "@/components/admin/Topbar";
import { GenerateForm } from "@/components/admin/GenerateForm";
import { getAllCodes } from "@/lib/sheets/codes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GeneratePage() {
  const codes = await getAllCodes();

  return (
    <>
      <Topbar
        title="Generar codigos"
        description="Cada batch se agrega al sheet existente. El acumulado crece con cada ejecucion."
      />
      <div className="p-4 sm:p-6 lg:p-8">
        <GenerateForm currentTotal={codes.length} maxPerBatch={100} />
      </div>
    </>
  );
}
