"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type PortalRole = "aluno" | "professor";

export function isPortalRole(value: string): value is PortalRole {
  return value === "aluno" || value === "professor";
}

type PortalContextValue = {
  role: PortalRole;
  setRole: (role: PortalRole) => void;
};

const PortalContext = createContext<PortalContextValue | null>(null);

export function PortalProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [role, setRole] = useState<PortalRole>("aluno");

  useEffect(() => {
    const savedRole = window.localStorage.getItem("portal-escolar-role");
    if (savedRole && isPortalRole(savedRole)) {
      setRole(savedRole);
    }
  }, []);

  function updateRole(nextRole: PortalRole) {
    window.localStorage.setItem("portal-escolar-role", nextRole);
    setRole(nextRole);
  }

  return (
    <PortalContext.Provider value={{ role, setRole: updateRole }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal deve ser usado dentro de PortalProvider.");
  }
  return context;
}
