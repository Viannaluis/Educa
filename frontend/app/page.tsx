"use client";

import Link from "next/link";
import { BookOpenCheck, CalendarClock, CalendarDays, ClipboardCheck, ClipboardList, GraduationCap, Star } from "lucide-react";
import { usePortal } from "@/components/PortalProvider";

const upcomingLessons = [
  { subject: "Matemática", group: "8º Ano A", room: "Sala 12", time: "07:30" },
  { subject: "Ciências", group: "8º Ano A", room: "Laboratório", time: "09:20" },
  { subject: "História", group: "8º Ano A", room: "Sala 08", time: "10:10" },
];

const studentGrades = [
  { subject: "Matemática", average: "8,5" },
  { subject: "Ciências", average: "7,8" },
  { subject: "História", average: "6,2" },
];

export default function DashboardPage() {
  const { role } = usePortal();
  const isTeacher = role === "professor";

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Sábado, 17 de outubro</span>
          <h1>{isTeacher ? "Olá, professora Mariana" : "Olá, João Pedro"}</h1>
          <p>{isTeacher ? "Aqui está um resumo das suas aulas e atividades." : "Acompanhe seu desempenho e a rotina escolar."}</p>
        </div>
        <Link className="primary-button" href={isTeacher ? "/faltas" : "/calendario"}>
          {isTeacher ? "Registrar frequência" : "Ver calendário"}
        </Link>
      </div>

      <section aria-label="Resumo acadêmico" className="stats-grid">
        {isTeacher ? (
          <>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Turmas vinculadas</span><span className="stat-icon"><GraduationCap aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">4</div><div className="stat-note">Neste ano letivo</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Aulas de hoje</span><span className="stat-icon green"><CalendarClock aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">5</div><div className="stat-note">Próxima aula às <strong>07:30</strong></div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Frequências pendentes</span><span className="stat-icon orange"><ClipboardCheck aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">2</div><div className="stat-note">Aulas aguardando registro</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Notas para revisar</span><span className="stat-icon"><ClipboardList aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">8</div><div className="stat-note">Em suas turmas</div></article>
          </>
        ) : (
          <>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Média geral</span><span className="stat-icon"><Star aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">7,8</div><div className="stat-note">Bom trabalho neste bimestre</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Frequência</span><span className="stat-icon green"><ClipboardCheck aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">94%</div><div className="stat-note">Dentro da frequência esperada</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Próxima aula</span><span className="stat-icon orange"><CalendarClock aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">07:30</div><div className="stat-note">Matemática · Sala 12</div></article>
            <article className="stat-card"><div className="stat-top"><span className="stat-label">Próxima avaliação</span><span className="stat-icon"><CalendarDays aria-hidden="true" className="ui-icon" /></span></div><div className="stat-value">21 out.</div><div className="stat-note">Ciências · Prova bimestral</div></article>
          </>
        )}
      </section>

      <section className="dashboard-grid">
        {isTeacher ? (
          <article className="panel">
            <div className="panel-header"><h2>Próximas aulas</h2><Link href="/grade">Ver grade completa</Link></div>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Horário</th><th>Disciplina</th><th>Turma</th><th>Local</th></tr></thead>
              <tbody>{upcomingLessons.map((lesson) => <tr key={lesson.time}><td>{lesson.time}</td><td>{lesson.subject}</td><td>{lesson.group}</td><td>{lesson.room}</td></tr>)}</tbody>
            </table></div>
          </article>
        ) : (
          <article className="panel">
            <div className="panel-header"><h2>Notas recentes</h2><Link href="/notas">Ver todas</Link></div>
            <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Disciplina</th><th>Média</th><th>Situação</th></tr></thead>
              <tbody>{studentGrades.map((grade) => <tr key={grade.subject}><td>{grade.subject}</td><td>{grade.average}</td><td><span className="status"><BookOpenCheck aria-hidden="true" className="status-icon" />Nota publicada</span></td></tr>)}</tbody>
            </table></div>
          </article>
        )}
        <article className="panel">
          <div className="panel-header"><h2>{isTeacher ? "Agenda de hoje" : "Próximos eventos"}</h2><Link href="/calendario">Abrir calendário</Link></div>
          <div className="activity-list">
            <div className="activity-item"><span className="activity-date">21<span>OUT</span></span><div><p><strong>Prova bimestral de Ciências</strong></p><time>Quarta-feira · 08:00</time></div></div>
            <div className="activity-item"><span className="activity-date">24<span>OUT</span></span><div><p><strong>Entrega do trabalho de História</strong></p><time>Sábado · até 17:00</time></div></div>
            <div className="activity-item"><span className="activity-date">02<span>NOV</span></span><div><p><strong>Feriado — Finados</strong></p><time>Domingo</time></div></div>
          </div>
        </article>
      </section>
    </>
  );
}
