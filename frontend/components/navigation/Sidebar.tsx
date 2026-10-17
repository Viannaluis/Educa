"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, ClipboardCheck, ClipboardList, House, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePortal } from "@/components/PortalProvider";

const baseNavigation = [
  { label: "Visão geral", href: "/", icon: House },
  { label: "Notas", href: "/notas", icon: ClipboardList },
  { label: "Faltas", href: "/faltas", icon: ClipboardCheck },
  { label: "Grade horária", href: "/grade", icon: CalendarDays },
  { label: "Calendário", href: "/calendario", icon: CalendarDays },
  { label: "Meu perfil", href: "/perfil", icon: UserRound },
] satisfies { label: string; href: string; icon: LucideIcon }[];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = usePortal();
  const navigation = baseNavigation.map((item) => item.href === "/notas" && role === "professor"
    ? { ...item, label: "Notas e avaliações" }
    : item);

  function renderLinks(items: typeof baseNavigation) {
    return items.map((item) => {
      const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
      const Icon = item.icon;
      return (
        <Link aria-label={item.label} className={`nav-link${active ? " active" : ""}`} href={item.href} key={item.href}>
          <Icon aria-hidden="true" className="nav-icon" />
          <span>{item.label}</span>
        </Link>
      );
    });
  }

  return (
    <aside className="sidebar">
      <Link aria-label="Educa, início" className="brand" href="/">
        <span className="brand-mark">E</span>
        Educa
      </Link>
      <div className="nav-label">Menu principal</div>
      <nav aria-label="Menu principal" className="nav-list">{renderLinks(navigation)}</nav>
      <div className="sidebar-footer">Portal Escolar<br />Ano letivo 2026</div>
    </aside>
  );
}
