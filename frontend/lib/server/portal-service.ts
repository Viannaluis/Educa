import { ApiError } from "@/lib/server/api-response";

export type PortalRole = "aluno" | "professor";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: PortalRole;
  relationship: string;
  institution: string;
  schoolYear: number;
};

type Student = {
  id: string;
  name: string;
  classId: string;
};

type GradeRecord = {
  studentId: string;
  subject: string;
  assessment: string;
  score: number;
};

type AttendanceRecord = {
  studentId: string;
  subject: string;
  date: string;
  lesson: string;
};

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  detail: string;
  type: "Avaliação" | "Entrega" | "Evento" | "Feriado";
  classId?: string;
};

const profiles: Record<PortalRole, Profile> = {
  aluno: {
    id: "2026005",
    name: "João Pedro Silva",
    email: "joao.silva@aluno.edu.br",
    role: "aluno",
    relationship: "8º Ano A · Período da manhã",
    institution: "Escola Horizonte",
    schoolYear: 2026,
  },
  professor: {
    id: "prof-01",
    name: "Mariana Costa",
    email: "mariana.costa@escola.edu.br",
    role: "professor",
    relationship: "Matemática · 7º e 8º anos",
    institution: "Escola Horizonte",
    schoolYear: 2026,
  },
};

const classes = [
  { id: "8A", name: "8º Ano A", subjects: ["Matemática", "Ciências"] },
  { id: "7B", name: "7º Ano B", subjects: ["Matemática"] },
];

const students: Student[] = [
  { id: "2026001", name: "Ana Clara Lima", classId: "8A" },
  { id: "2026002", name: "Bruno Carvalho", classId: "8A" },
  { id: "2026003", name: "Isabela Martins", classId: "8A" },
  { id: "2026004", name: "Lucas Oliveira", classId: "8A" },
  { id: profiles.aluno.id, name: profiles.aluno.name, classId: "8A" },
  { id: "2027001", name: "Sofia Ferreira", classId: "7B" },
];

const gradeRecords: GradeRecord[] = [
  {
    studentId: profiles.aluno.id,
    subject: "Matemática",
    assessment: "1º bimestre",
    score: 8.5,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Matemática",
    assessment: "2º bimestre",
    score: 8.5,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Língua Portuguesa",
    assessment: "1º bimestre",
    score: 7.2,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Língua Portuguesa",
    assessment: "2º bimestre",
    score: 8.1,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Ciências",
    assessment: "1º bimestre",
    score: 6.8,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Ciências",
    assessment: "2º bimestre",
    score: 7.8,
  },
  {
    studentId: profiles.aluno.id,
    subject: "História",
    assessment: "1º bimestre",
    score: 6.2,
  },
  {
    studentId: profiles.aluno.id,
    subject: "História",
    assessment: "2º bimestre",
    score: 6.2,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Geografia",
    assessment: "1º bimestre",
    score: 9.0,
  },
  {
    studentId: profiles.aluno.id,
    subject: "Geografia",
    assessment: "2º bimestre",
    score: 8.6,
  },
  {
    studentId: "2026001",
    subject: "Matemática",
    assessment: "Prova bimestral",
    score: 8.5,
  },
  {
    studentId: "2026002",
    subject: "Matemática",
    assessment: "Prova bimestral",
    score: 7.0,
  },
  {
    studentId: "2026003",
    subject: "Matemática",
    assessment: "Prova bimestral",
    score: 9.2,
  },
];

const attendanceRecords: AttendanceRecord[] = [
  {
    studentId: profiles.aluno.id,
    subject: "Matemática",
    date: "2026-03-04",
    lesson: "1ª aula",
  },
  {
    studentId: profiles.aluno.id,
    subject: "Matemática",
    date: "2026-04-08",
    lesson: "1ª aula",
  },
  {
    studentId: profiles.aluno.id,
    subject: "Língua Portuguesa",
    date: "2026-05-11",
    lesson: "2ª aula",
  },
  {
    studentId: profiles.aluno.id,
    subject: "Ciências",
    date: "2026-06-02",
    lesson: "3ª aula",
  },
  {
    studentId: profiles.aluno.id,
    subject: "Ciências",
    date: "2026-07-14",
    lesson: "3ª aula",
  },
  {
    studentId: profiles.aluno.id,
    subject: "Ciências",
    date: "2026-08-19",
    lesson: "3ª aula",
  },
];

const calendarEvents: CalendarEvent[] = [
  {
    id: "event-1",
    date: "2026-10-21",
    title: "Prova bimestral de Ciências",
    detail: "8º Ano A · 08:00",
    type: "Avaliação",
    classId: "8A",
  },
  {
    id: "event-2",
    date: "2026-10-24",
    title: "Entrega do trabalho de História",
    detail: "Todas as turmas · até 17:00",
    type: "Entrega",
  },
  {
    id: "event-3",
    date: "2026-10-28",
    title: "Reunião pedagógica",
    detail: "Sala dos professores · 14:00",
    type: "Evento",
  },
  {
    id: "event-4",
    date: "2026-11-02",
    title: "Finados",
    detail: "Feriado nacional",
    type: "Feriado",
  },
  {
    id: "event-5",
    date: "2026-11-07",
    title: "Prova de Matemática",
    detail: "8º Ano A · 09:30",
    type: "Avaliação",
    classId: "8A",
  },
];

const timetable = [
  {
    time: "07:30–08:20",
    weekday: "Segunda",
    subject: "Matemática",
    teacher: "Mariana Costa",
    room: "Sala 12",
  },
  {
    time: "08:20–09:10",
    weekday: "Terça",
    subject: "Língua Portuguesa",
    teacher: "Paulo Nunes",
    room: "Sala 08",
  },
  {
    time: "09:30–10:20",
    weekday: "Quarta",
    subject: "Ciências",
    teacher: "Camila Rocha",
    room: "Lab. 2",
  },
  {
    time: "10:20–11:10",
    weekday: "Quinta",
    subject: "Geografia",
    teacher: "Beatriz Lima",
    room: "Sala 10",
  },
  {
    time: "07:30–08:20",
    weekday: "Sexta",
    subject: "História",
    teacher: "Felipe Santos",
    room: "Sala 05",
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseRole(value: string | null): PortalRole {
  if (value === null || value === "") return "aluno";
  if (value === "aluno" || value === "professor") return value;
  throw new ApiError("O perfil deve ser 'aluno' ou 'professor'.", 400);
}

function getClass(classId: string) {
  const schoolClass = classes.find((item) => item.id === classId);
  if (!schoolClass) throw new ApiError("Turma não encontrada.", 404);
  return schoolClass;
}

function average(scores: number[]) {
  if (scores.length === 0) return null;
  return (
    Math.round(
      (scores.reduce((total, score) => total + score, 0) / scores.length) * 10,
    ) / 10
  );
}

export function getProfile(role: PortalRole) {
  return profiles[role];
}

export function getDashboard(role: PortalRole) {
  const profile = profiles[role];
  const studentGrades = gradeRecords.filter(
    (record) => record.studentId === profile.id,
  );
  const studentAbsences = attendanceRecords.filter(
    (record) => record.studentId === profile.id,
  );
  const upcomingEvents = calendarEvents.slice(0, 3);

  return role === "aluno"
    ? {
        profile,
        summary: {
          overallAverage: average(studentGrades.map((record) => record.score)),
          recordedAbsences: studentAbsences.length,
          upcomingEvents: upcomingEvents.length,
        },
        upcomingEvents,
      }
    : {
        profile,
        summary: {
          classes: classes.length,
          students: students.length,
          upcomingEvents: upcomingEvents.length,
        },
        upcomingEvents,
      };
}

export function getGrades(role: PortalRole) {
  if (role === "professor") {
    throw new ApiError(
      "A consulta de notas está disponível para o perfil de aluno neste protótipo.",
      403,
    );
  }

  const studentRecords = gradeRecords.filter(
    (record) => record.studentId === profiles.aluno.id,
  );
  const subjects = Array.from(
    new Set(studentRecords.map((record) => record.subject)),
  );
  return subjects.map((subject) => {
    const records = studentRecords.filter(
      (record) => record.subject === subject,
    );
    return {
      subject,
      assessments: records.map(({ assessment, score }) => ({
        assessment,
        score,
      })),
      average: average(records.map((record) => record.score)),
    };
  });
}

export function getAbsences(role: PortalRole) {
  if (role !== "aluno") {
    throw new ApiError(
      "A consulta de faltas está disponível para o perfil de aluno neste protótipo.",
      403,
    );
  }

  const studentRecords = attendanceRecords.filter(
    (record) => record.studentId === profiles.aluno.id,
  );
  const subjects = Array.from(
    new Set(studentRecords.map((record) => record.subject)),
  );
  return subjects.map((subject) => ({
    subject,
    absences: studentRecords.filter((record) => record.subject === subject)
      .length,
    records: studentRecords.filter((record) => record.subject === subject),
  }));
}

export function getClasses() {
  return classes.map((schoolClass) => ({
    ...schoolClass,
    studentCount: students.filter(
      (student) => student.classId === schoolClass.id,
    ).length,
  }));
}

export function getClassStudents(classId: string) {
  getClass(classId);
  return students.filter((student) => student.classId === classId);
}

export function saveGrades(classId: string, value: unknown) {
  const schoolClass = getClass(classId);
  if (
    !isRecord(value) ||
    typeof value.subject !== "string" ||
    !schoolClass.subjects.includes(value.subject) ||
    typeof value.assessment !== "string" ||
    value.assessment.trim() === "" ||
    !Array.isArray(value.grades)
  ) {
    throw new ApiError(
      "Informe uma disciplina, uma avaliação e a lista de notas.",
      400,
    );
  }

  const updates: GradeRecord[] = [];
  const seenStudentIds = new Set<string>();
  for (const item of value.grades) {
    if (
      !isRecord(item) ||
      typeof item.studentId !== "string" ||
      typeof item.score !== "number" ||
      !Number.isFinite(item.score) ||
      item.score < 0 ||
      item.score > 10
    ) {
      throw new ApiError(
        "Cada nota deve ter uma matrícula e um valor numérico entre 0 e 10.",
        400,
      );
    }
    if (
      !students.some(
        (student) =>
          student.id === item.studentId && student.classId === classId,
      )
    ) {
      throw new ApiError(
        "A lista contém um aluno que não pertence a esta turma.",
        400,
      );
    }
    if (seenStudentIds.has(item.studentId)) {
      throw new ApiError(
        "Não envie mais de uma nota para o mesmo aluno nesta avaliação.",
        400,
      );
    }
    seenStudentIds.add(item.studentId);
    updates.push({
      studentId: item.studentId,
      subject: value.subject,
      assessment: value.assessment.trim(),
      score: item.score,
    });
  }
  if (updates.length === 0)
    throw new ApiError("Informe pelo menos uma nota.", 400);

  for (const update of updates) {
    const currentIndex = gradeRecords.findIndex(
      (record) =>
        record.studentId === update.studentId &&
        record.subject === update.subject &&
        record.assessment === update.assessment,
    );
    if (currentIndex < 0) gradeRecords.push(update);
    else gradeRecords[currentIndex] = update;
  }

  return {
    classId,
    subject: value.subject,
    assessment: value.assessment.trim(),
    updatedCount: updates.length,
    grades: updates,
  };
}

export function saveAttendance(classId: string, value: unknown) {
  const schoolClass = getClass(classId);
  if (
    !isRecord(value) ||
    typeof value.subject !== "string" ||
    !schoolClass.subjects.includes(value.subject) ||
    typeof value.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value.date) ||
    typeof value.lesson !== "string" ||
    value.lesson.trim() === "" ||
    !Array.isArray(value.absentStudentIds) ||
    !value.absentStudentIds.every((id): id is string => typeof id === "string")
  ) {
    throw new ApiError(
      "Informe disciplina, data válida, aula e uma lista de matrículas ausentes.",
      400,
    );
  }

  const parsedDate = new Date(`${value.date}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== value.date
  ) {
    throw new ApiError("Informe uma data válida.", 400);
  }

  const absentStudentIds = value.absentStudentIds as string[];
  if (new Set(absentStudentIds).size !== absentStudentIds.length) {
    throw new ApiError(
      "A lista de ausências não pode repetir matrículas.",
      400,
    );
  }
  if (
    absentStudentIds.some(
      (studentId) =>
        !students.some(
          (student) => student.id === studentId && student.classId === classId,
        ),
    )
  ) {
    throw new ApiError(
      "A lista contém um aluno que não pertence a esta turma.",
      400,
    );
  }

  const key = (record: AttendanceRecord) =>
    record.date === value.date &&
    record.lesson === value.lesson &&
    record.subject === value.subject;
  const previous = attendanceRecords.filter(
    (record) =>
      key(record) &&
      students.some(
        (student) =>
          student.id === record.studentId && student.classId === classId,
      ),
  );
  for (const record of previous) {
    const index = attendanceRecords.indexOf(record);
    attendanceRecords.splice(index, 1);
  }
  for (const studentId of absentStudentIds) {
    attendanceRecords.push({
      studentId,
      subject: value.subject,
      date: value.date,
      lesson: value.lesson.trim(),
    });
  }

  return {
    classId,
    subject: value.subject,
    date: value.date,
    lesson: value.lesson.trim(),
    absentCount: absentStudentIds.length,
  };
}

export function getTimetable(role: PortalRole) {
  return {
    role,
    class: role === "aluno" ? "8º Ano A" : "Turmas atribuídas",
    entries: timetable,
  };
}

export function getCalendarEvents(searchParams: URLSearchParams) {
  const type = searchParams.get("tipo");
  const classId = searchParams.get("turmaId");
  const filtered = calendarEvents.filter(
    (event) =>
      (!type || event.type === type) &&
      (!classId || !event.classId || event.classId === classId),
  );
  return filtered;
}
