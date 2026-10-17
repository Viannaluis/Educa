"use client";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { isPortalRole, usePortal } from "@/components/PortalProvider";

export function Topbar() {
  const { role, setRole } = usePortal();
  const displayName = role === "aluno" ? "João Pedro Silva" : "Mariana Costa";

  return (
    <header className="topbar">
      <div className="breadcrumb">Portal Escolar <span aria-hidden="true">/</span> Área do {role}</div>
      <div className="topbar-actions">
        <ThemeToggle />
        <label className="role-preview">
          <span>Visualizar como</span>
          <select aria-label="Selecionar perfil de demonstração" onChange={(event) => {
            if (isPortalRole(event.target.value)) setRole(event.target.value);
          }} value={role}>
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
        </label>
        <div className="user-menu">
          <span className="avatar">{role === "aluno" ? "JP" : "MC"}</span>
          <div><div className="user-name">{displayName}</div><div className="user-role">{role === "aluno" ? "Aluno · 8º Ano A" : "Professora"}</div></div>
        </div>
      </div>
    </header>
  );
}
