"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/navigation/Sidebar";
import { Topbar } from "@/components/navigation/Topbar";
import { PortalProvider } from "@/components/PortalProvider";

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const isAuthPage = ["/auth", "/login", "/signup"].includes(pathname);

  if (isAuthPage) {
    return <PortalProvider>{children}</PortalProvider>;
  }

  return (
    <PortalProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <main className="main-content">{children}</main>
        </div>
      </div>
    </PortalProvider>
  );
}
