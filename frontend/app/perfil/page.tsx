"use client";

import { PageHeading } from "@/components/PageHeading";
import { usePortal } from "@/components/PortalProvider";

export default function ProfilePage() {
  const { role } = usePortal();
  const isTeacher = role === "professor";

  return (
    <>
      <PageHeading title="Meu perfil" description="Seus dados de identificação e vínculo escolar." />
      <section className="profile-grid">
        <article className="panel profile-summary">
          <span className="profile-avatar">{isTeacher ? "MC" : "JP"}</span>
          <h2>{isTeacher ? "Mariana Costa" : "João Pedro Silva"}</h2>
          <p>{isTeacher ? "Professora de Matemática" : "Aluno · 8º Ano A"}</p>
          <span className="profile-status">Perfil demonstrativo</span>
        </article>
        <article className="panel">
          <div className="panel-header"><h2>Informações pessoais</h2></div>
          <dl className="profile-details">
            <div><dt>Nome completo</dt><dd>{isTeacher ? "Mariana Costa" : "João Pedro Silva"}</dd></div>
            <div><dt>E-mail</dt><dd>{isTeacher ? "mariana.costa@escola.edu.br" : "joao.silva@aluno.edu.br"}</dd></div>
            <div><dt>Perfil de acesso</dt><dd>{isTeacher ? "Professor(a)" : "Aluno(a)"}</dd></div>
            <div><dt>Instituição</dt><dd>Escola Horizonte</dd></div>
            <div><dt>{isTeacher ? "Disciplinas" : "Turma"}</dt><dd>{isTeacher ? "Matemática · 7º e 8º anos" : "8º Ano A · Período da manhã"}</dd></div>
            <div><dt>Ano letivo</dt><dd>2026</dd></div>
          </dl>
          <p className="helper-text table-footnote">Para atualizar seus dados, entre em contato com a secretaria da escola.</p>
        </article>
      </section>
    </>
  );
}
