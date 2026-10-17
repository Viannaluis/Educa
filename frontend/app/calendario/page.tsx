"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeading } from "@/components/PageHeading";

const events = [
  { day: "21", month: "OUT", title: "Prova bimestral de Ciências", detail: "8º Ano A · 08:00", type: "Avaliação" },
  { day: "24", month: "OUT", title: "Entrega do trabalho de História", detail: "Todas as turmas · até 17:00", type: "Entrega" },
  { day: "28", month: "OUT", title: "Reunião pedagógica", detail: "Sala dos professores · 14:00", type: "Evento" },
  { day: "02", month: "NOV", title: "Finados", detail: "Feriado nacional", type: "Feriado" },
  { day: "07", month: "NOV", title: "Prova de Matemática", detail: "8º Ano A · 09:30", type: "Avaliação" },
];

const filters = ["Todos", "Avaliação", "Entrega", "Evento", "Feriado"];

export default function CalendarPage() {
  const [filter, setFilter] = useState("Todos");
  const [month, setMonth] = useState(9);
  const [selectedDay, setSelectedDay] = useState(17);
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const filteredEvents = filter === "Todos" ? events : events.filter((event) => event.type === filter);
  const monthOffset = new Date(2026, month, 1).getDay();
  const daysInMonth = new Date(2026, month + 1, 0).getDate();

  function changeMonth(amount: number) {
    setMonth((current) => (current + amount + 12) % 12);
    setSelectedDay(0);
  }

  return (
    <>
      <PageHeading title="Calendário escolar" description="Provas, entregas, feriados e eventos importantes da escola." />
      <section className="calendar-layout">
        <article className="panel calendar-panel">
          <div className="panel-header">
            <div><span className="eyebrow">Ano letivo 2026</span><h2 className="calendar-month">{months[month]} 2026</h2></div>
            <div className="calendar-controls"><button aria-label="Mês anterior" className="icon-button calendar-arrow" onClick={() => changeMonth(-1)} type="button"><ChevronLeft aria-hidden="true" className="ui-icon" /></button><button aria-label="Próximo mês" className="icon-button calendar-arrow" onClick={() => changeMonth(1)} type="button"><ChevronRight aria-hidden="true" className="ui-icon" /></button></div>
          </div>
          <div className="calendar-grid">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => <span className="calendar-weekday" key={`${day}-${index}`}>{day}</span>)}
            {Array.from({ length: 42 }, (_, index) => {
              const day = index - monthOffset + 1;
              const isCurrentMonth = day > 0 && day <= daysInMonth;
              const hasEvent = isCurrentMonth && events.some((event) => event.day === String(day).padStart(2, "0") && event.month === months[month].slice(0, 3).toUpperCase());
              const dayLabel = isCurrentMonth
                ? day
                : day <= 0
                  ? new Date(2026, month, day).getDate()
                  : day - daysInMonth;
              return <button aria-label={isCurrentMonth ? `${day} de ${months[month]}` : undefined} aria-pressed={isCurrentMonth && selectedDay === day} className={`calendar-day${isCurrentMonth ? "" : " muted-day"}${day === 17 && month === 9 ? " today" : ""}${isCurrentMonth && selectedDay === day ? " selected-day" : ""}${hasEvent ? " has-event" : ""}`} disabled={!isCurrentMonth} key={index} onClick={() => setSelectedDay(day)} type="button">{dayLabel}</button>;
            })}
          </div>
          <div className="calendar-legend"><span><i className="legend-dot assessment" />Avaliação</span><span><i className="legend-dot event" />Evento/entrega</span></div>
        </article>
        <article className="panel events-panel">
          <div className="panel-header"><h2>Próximos eventos</h2></div>
          <div aria-label="Filtrar eventos" className="filter-chips">{filters.map((item) => <button aria-pressed={filter === item} className={`filter-chip${filter === item ? " active" : ""}`} key={item} onClick={() => setFilter(item)} type="button">{item}</button>)}</div>
          <div className="event-list">{filteredEvents.map((event) => <article className="event-card" key={event.title}><div className="event-date"><strong>{event.day}</strong><span>{event.month}</span></div><div className="event-info"><span className={`event-type event-${event.type.toLowerCase()}`}>{event.type}</span><h3>{event.title}</h3><p>{event.detail}</p></div></article>)}</div>
        </article>
      </section>
    </>
  );
}
