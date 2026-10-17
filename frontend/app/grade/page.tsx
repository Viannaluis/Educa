import { PageHeading } from "@/components/PageHeading";

const weekdays = ["Horário", "Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const timetable = [
  { time: "07:30 – 08:20", lessons: ["Matemática", "Português", "Ciências", "Matemática", "História"] },
  { time: "08:20 – 09:10", lessons: ["Matemática", "Português", "Ciências", "Geografia", "História"] },
  { time: "09:10 – 09:30", lessons: ["Intervalo", "Intervalo", "Intervalo", "Intervalo", "Intervalo"] },
  { time: "09:30 – 10:20", lessons: ["Ciências", "História", "Matemática", "Português", "Geografia"] },
  { time: "10:20 – 11:10", lessons: ["Geografia", "Educação Física", "Artes", "Ciências", "Português"] },
];

export default function TimetablePage() {
  return (
    <>
      <PageHeading title="Grade horária" description="Confira seus horários de aula durante a semana." />
      <section className="panel">
        <div className="panel-header">
          <div><h2>8º Ano A</h2><p className="panel-subtitle">Período da manhã · Ano letivo 2026</p></div>
          <span className="term-badge">2º bimestre</span>
        </div>
        <div className="table-wrap timetable-wrap">
          <table className="data-table timetable">
            <thead><tr>{weekdays.map((day) => <th key={day}>{day}</th>)}</tr></thead>
            <tbody>{timetable.map((row) => <tr className={row.lessons[0] === "Intervalo" ? "break-row" : ""} key={row.time}>
              <th>{row.time}</th>{row.lessons.map((lesson, index) => <td key={`${row.time}-${index}`}>{lesson === "Intervalo" ? <span className="break-label">Intervalo</span> : <span className={`lesson-chip lesson-${index % 4}`}>{lesson}<small>{["Sala 12", "Sala 08", "Lab. 2", "Sala 10", "Sala 05"][index]}</small></span>}</td>)}
            </tr>)}</tbody>
          </table>
        </div>
        <p className="helper-text table-footnote">Esta grade é um exemplo visual. A grade real depende da turma e dos vínculos escolares.</p>
      </section>
    </>
  );
}
