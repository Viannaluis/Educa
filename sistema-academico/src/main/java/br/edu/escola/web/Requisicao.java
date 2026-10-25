package br.edu.escola.web;

import java.util.List;
import java.util.Map;

/** Requisição já interpretada: corpo JSON e parâmetros numéricos extraídos da URL. */
public record Requisicao(String metodo, String caminho, String token, Map<String, Object> corpo, List<Integer> ids) {
}
