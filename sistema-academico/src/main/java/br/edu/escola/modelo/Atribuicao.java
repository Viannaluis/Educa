package br.edu.escola.modelo;

/** Vínculo do professor com uma disciplina em uma turma. */
public record Atribuicao(int professorId, int turmaId, int disciplinaId) {
}
