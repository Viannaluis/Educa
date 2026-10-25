package br.edu.escola.modelo;

import java.time.LocalDate;

public record Falta(int alunoId, int disciplinaId, LocalDate data, boolean justificada) {
}
