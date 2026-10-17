"use client";

import { useState } from "react";
import { PageHeading } from "@/components/PageHeading";
import { usePortal } from "@/components/PortalProvider";

const absences = [
  { subject: "Matemática", absences: 2, total: 42 },
  { subject: "Língua Portuguesa", absences: 1, total: 40 },
  { subject: "Ciências", absences: 3, total: 38 },
  { subject: "História", absences: 0, total: 36 },
];

const classRoster = ["Ana Clara Lima", "Bruno Carvalho", "Isabela Martins", "Lucas Oliveira", "Sofia Ferreira"];

export default function AttendancePage() {
  const { role } = usePortal();
  const [absentStudents, setAbsentStudents] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function toggleAbsence(name: string) {
    setAbsentStudents((current) => current.includes(name) ? current.filter((student) => student !== name) : [...current, name]);
  }

  if (role === "professor") {
    return (
      <>
        <PageHeading title="Registro de frequência" description="Marque as ausências da turma para a aula selecionada." />
        <section className="panel">
          <div className="filter-row">
            <label>Turma<select className="select-field" defaultValue="8º Ano A"><option>8º Ano A</option><option>7º Ano B</option></select></label>
            <label>Disciplina<select className="select-field" defaultValue="Matemática"><option>Matemática</option><option>Ciências</option></select></label>
            <label>Data<input className="select-field" defaultValue="2026-10-17" type="date" /></label>
            <label>Aula<select className="select-field" defaultValue="1ª aula · 07:30"><option>1ª aula · 07:30</option><option>2ª aula · 08:20</option></select></label>
          </div>
          <div className="attendance-summary">{classRoster.length} alunos na turma <span>{absentStudents.length} ausência(s) marcada(s)</span></div>
          <div className="attendance-list">{classRoster.map((name) => (
            <label className="attendance-row" key={name}>
              <span className="avatar">{name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
              <span className="attendance-student">{name}<small>Presente por padrão</small></span>
              <span className={`attendance-toggle${absentStudents.includes(name) ? " selected" : ""}`}>{absentStudents.includes(name) ? "Ausente" : "Presente"}</span>
              <input aria-label={`Marcar ${name} como ausente`} checked={absentStudents.includes(name)} onChange={() => toggleAbsence(name)} type="checkbox" />
            </label>
          ))}</div>
          <div className="form-actions"><span className="helper-text">Marque apenas os alunos ausentes.</span><button className="primary-button" onClick={() => setMessage("Frequência atualizada nesta demonstração. Nenhum dado foi enviado ou salvo.")} type="button">Confirmar frequência</button></div>
          {message && <p aria-live="polite" className="notice">{message}</p>}
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Minhas faltas" description="Acompanhe sua frequência por disciplina." />
      <section aria-label="Resumo de frequência" className="stats-grid stats-grid-three">
        <article className="stat-card"><span className="stat-label">Frequência geral</span><div className="stat-value">94%</div><div className="stat-note">Sua presença nas aulas</div></article>
        <article className="stat-card"><span className="stat-label">Faltas registradas</span><div className="stat-value">6</div><div className="stat-note">No ano letivo de 2026</div></article>
        <article className="stat-card"><span className="stat-label">Disciplina com maior frequência</span><div className="stat-value">História</div><div className="stat-note">Nenhuma falta registrada</div></article>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Frequência por disciplina</h2><span className="helper-text">Ano letivo 2026</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Disciplina</th><th>Faltas</th><th>Aulas dadas</th><th>Presença</th><th>Frequência</th></tr></thead>
          <tbody>{absences.map((item) => {
            const attendance = Math.round(((item.total - item.absences) / item.total) * 100);
            return <tr key={item.subject}><td>{item.subject}</td><td>{item.absences}</td><td>{item.total}</td><td>{item.total - item.absences} aulas</td><td><div className="progress-cell"><span className="progress-track"><span style={{ width: `${attendance}%` }} /></span><strong>{attendance}%</strong></div></td></tr>;
          })}</tbody>
        </table></div>
        <p className="helper-text table-footnote">Consulte a secretaria da escola em caso de dúvidas sobre seus registros.</p>
      </section>
    </>
  );
}
