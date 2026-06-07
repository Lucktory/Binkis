import { Topbar } from "@/components/admin/Topbar";
import { CodeChecker } from "@/components/admin/CodeChecker";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <>
      <Topbar
        title="Verificar codigo"
        description="Confirma si un codigo cualquiera es ganador, ya fue reclamado o no existe."
      />
      <div className="p-8">
        <CodeChecker />
      </div>
    </>
  );
}
