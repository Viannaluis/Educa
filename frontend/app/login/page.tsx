"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { isPortalRole, usePortal } from "@/components/PortalProvider";

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole } = usePortal();
  const [selectedRole, setSelectedRole] = useState(role);

  useEffect(() => {
    setSelectedRole(role);
  }, [role]);

  function enterDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isPortalRole(selectedRole)) return;
    setRole(selectedRole);
    router.push("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" href="/"><span className="brand-mark">E</span>Educa</Link>
        <h1>Acesse o Portal Escolar</h1>
        <p>Entre para consultar sua rotina e informações acadêmicas.</p>
        <form action="/login" className="auth-form" method="post" onSubmit={enterDemo}>
          <label htmlFor="email">E-mail</label>
          <input autoComplete="email" id="email" name="email" placeholder="voce@escola.edu.br" required type="email" />
          <label htmlFor="password">Senha</label>
          <input autoComplete="current-password" id="password" name="password" placeholder="Digite sua senha" required type="password" />
          <label htmlFor="profile">Perfil de demonstração</label>
          <select className="select-field auth-select" id="profile" onChange={(event) => {
            if (isPortalRole(event.target.value)) setSelectedRole(event.target.value);
          }} value={selectedRole}>
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
          <button className="primary-button" type="submit">Acessar demonstração</button>
        </form>
        <p className="demo-disclaimer">Protótipo visual: o acesso não autentica credenciais nem conecta a um servidor.</p>
      </section>
    </main>
  );
}
