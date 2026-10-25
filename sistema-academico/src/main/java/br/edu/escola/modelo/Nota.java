package br.edu.escola.modelo;

public record Nota(int id, int alunoId, int turmaId, int disciplinaId, String descricao, double valor) {
}
