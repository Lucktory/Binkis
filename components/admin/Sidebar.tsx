"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Hash, PlusSquare, Trophy, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  description: string;
}

const overviewItems: NavItem[] = [
  {
    href: "/",
    label: "Resumen",
    icon: LayoutDashboard,
    description: "Metricas generales",
  },
];

const codesItems: NavItem[] = [
  {
    href: "/codes",
    label: "Codigos",
    icon: Hash,
    description: "Inventario completo",
  },
  {
    href: "/generate",
    label: "Generar",
    icon: PlusSquare,
    description: "Nuevo batch",
  },
  {
    href: "/verify",
    label: "Verificar",
    icon: ShieldCheck,
    description: "Comprobar un codigo",
  },
  {
    href: "/winners",
    label: "Ganadores",
    icon: Trophy,
    description: "Reclamos confirmados",
  },
];

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-surface-muted text-ink-900"
          : "text-ink-500 hover:bg-surface-muted hover:text-ink-900"
      )}
    >
      {active ? (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-accent" />
      ) : null}
      <Icon size={16} strokeWidth={2} className={active ? "text-ink-900" : "text-ink-400 group-hover:text-ink-700"} />
      <span>{item.label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-200 bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-ink-200 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-white">
            <span className="font-mono text-xs font-bold">BK</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-ink-900">BinKis</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-400">Validacion</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto p-3">
        <div className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            General
          </p>
          {overviewItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
            Codigos
          </p>
          {codesItems.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </nav>

      <div className="border-t border-ink-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold text-ink-900">Coleccion 777</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-400">Edicion Limitada</span>
          </div>
          <div className="flex h-2 w-2 items-center justify-center rounded-full bg-status-claimed" title="Sheet conectado" />
        </div>
      </div>
    </aside>
  );
}
