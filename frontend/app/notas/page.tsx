"use client";

import { useState } from "react";
import { PageHeading } from "@/components/PageHeading";
import { usePortal } from "@/components/PortalProvider";

const subjects = [
  { subject: "Matemática", teacher: "Mariana Costa", first: 8.5, second: 8.5, average: "8,5" },
  { subject: "Língua Portuguesa", teacher: "Paulo Nunes", first: 7.2, second: 8.1, average: "7,7" },
  { subject: "Ciências", teacher: "Camila Rocha", first: 6.8, second: 7.8, average: "7,3" },
  { subject: "História", teacher: "Felipe Santos", first: 6.2, second: 6.2, average: "6,2" },
  { subject: "Geografia", teacher: "Beatriz Lima", first: 9.0, second: 8.6, average: "8,8" },
];

const roster = [
  { name: "Ana Clara Lima", id: "2026001", score: "8.5" },
  { name: "Bruno Carvalho", id: "2026002", score: "7.0" },
  { name: "Isabela Martins", id: "2026003", score: "9.2" },
  { name: "Lucas Oliveira", id: "2026004", score: "" },
];

export default function GradesPage() {
  const { role } = usePortal();
  const [message, setMessage] = useState("");

  if (role === "professor") {
    return (
      <>
        <PageHeading title="Lançamento de notas" description="Selecione a turma e registre as avaliações dos seus alunos." />
        <section className="panel">
          <div className="filter-row">
            <label>Turma<select className="select-field" defaultValue="8º Ano A"><option>8º Ano A</option><option>7º Ano B</option><option>9º Ano C</option></select></label>
            <label>Disciplina<select className="select-field" defaultValue="Matemática"><option>Matemática</option><option>Ciências</option></select></label>
            <label>Avaliação<select className="select-field" defaultValue="Prova bimestral"><option>Prova bimestral</option><option>Trabalho em grupo</option></select></label>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); setMessage("Notas atualizadas nesta demonstração. Os dados não foram enviados nem salvos."); }}>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Aluno(a)</th><th>Matrícula</th><th>Nota (0–10)</th><th>Prévia</th></tr></thead>
              <tbody>{roster.map((student) => <tr key={student.id}>
                <td>{student.name}</td><td>{student.id}</td>
                <td><input aria-label={`Nota de ${student.name}`} className="grade-input" defaultValue={student.score} max="10" min="0" placeholder="—" required step="0.1" type="number" /></td>
                <td>{student.score ? `${student.score.replace(".", ",")} / 10` : "Não lançada"}</td>
              </tr>)}</tbody>
            </table></div>
            <div className="form-actions"><span className="helper-text">As notas devem estar entre 0 e 10.</span><button className="primary-button" type="submit">Salvar notas</button></div>
            {message && <p aria-live="polite" className="notice">{message}</p>}
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeading title="Minhas notas" description="Consulte seu desempenho por disciplina neste ano letivo." />
      <section aria-label="Resumo das notas" className="stats-grid stats-grid-three">
        <article className="stat-card"><span className="stat-label">Média geral</span><div className="stat-value">7,8</div><div className="stat-note">De todas as disciplinas</div></article>
        <article className="stat-card"><span className="stat-label">Disciplinas com notas</span><div className="stat-value">5 de 6</div><div className="stat-note">Notas disponíveis neste período</div></article>
        <article className="stat-card"><span className="stat-label">Período atual</span><div className="stat-value">2º bim.</div><div className="stat-note">Ano letivo de 2026</div></article>
      </section>
      <section className="panel">
        <div className="panel-header"><h2>Desempenho por disciplina</h2><span className="helper-text">Médias demonstrativas</span></div>
        <div className="table-wrap"><table className="data-table">
          <thead><tr><th>Disciplina</th><th>Professor(a)</th><th>1º bimestre</th><th>2º bimestre</th><th>Média atual</th><th>Situação</th></tr></thead>
          <tbody>{subjects.map((item) => <tr key={item.subject}><td>{item.subject}</td><td>{item.teacher}</td><td>{item.first.toFixed(1).replace(".", ",")}</td><td>{item.second.toFixed(1).replace(".", ",")}</td><td><strong>{item.average}</strong></td><td><span className="status">Nota publicada</span></td></tr>)}</tbody>
        </table></div>
        <p className="helper-text table-footnote">As regras de aprovação dependem dos critérios da instituição e não são calculadas neste protótipo. As informações são fictícias, apenas para demonstração.</p>
      </section>
    </>
  );
}
