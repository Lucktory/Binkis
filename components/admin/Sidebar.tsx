"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Hash, PlusSquare, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { href: "/", label: "Resumen", icon: LayoutDashboard },
  { href: "/codes", label: "Codigos", icon: Hash },
  { href: "/generate", label: "Generar", icon: PlusSquare },
  { href: "/winners", label: "Ganadores", icon: Trophy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col border-r border-ink-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-ink-200 px-6">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-ink-900">BinKis</span>
          <span className="text-xs text-ink-400">Sistema de validacion</span>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-surface-muted text-ink-900"
                  : "text-ink-500 hover:bg-surface-muted hover:text-ink-900"
              )}
            >
              <Icon size={16} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-ink-200 p-4">
        <p className="text-xs text-ink-400">Coleccion No.777</p>
        <p className="mt-1 text-xs text-ink-300">Edicion Limitada</p>
      </div>
    </aside>
  );
}
