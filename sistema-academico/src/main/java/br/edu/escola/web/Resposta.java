package br.edu.escola.web;

/** Resposta HTTP: status e corpo (null = sem corpo). */
public record Resposta(int status, Object corpo) {

    public static Resposta ok(Object corpo) {
        return new Resposta(200, corpo);
    }
}
