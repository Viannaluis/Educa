package br.edu.escola.web;

import br.edu.escola.erro.ApiException;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.servico.Campos;
import br.edu.escola.servico.ServicoAutenticacao;
import br.edu.escola.servico.ServicoDashboard;
import br.edu.escola.servico.ServicoFaltas;
import br.edu.escola.servico.ServicoNotas;
import br.edu.escola.util.Json;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Servidor HTTP/JSON com as rotas dos requisitos RF01 a RF05. */
public final class Servidor {

    private enum Acesso {
        PUBLICO(null), AUTENTICADO(null), ALUNO(Perfil.ALUNO), PROFESSOR(Perfil.PROFESSOR);

        final Perfil perfilExigido;

        Acesso(Perfil perfilExigido) {
            this.perfilExigido = perfilExigido;
        }
    }

    @FunctionalInterface
    private interface Manipulador {
        Resposta tratar(Requisicao requisicao, Usuario usuario);
    }

    private record Rota(String metodo, Pattern padrao, Acesso acesso, Manipulador manipulador) {
    }

    private static final int LIMITE_CORPO_BYTES = 1_048_576;

    private final HttpServer http;
    private final List<Rota> rotas = new ArrayList<>();
    private final ServicoAutenticacao autenticacao;
    private final ServicoNotas notas;
    private final ServicoFaltas faltas;
    private final ServicoDashboard dashboard;

    public Servidor(int porta, ServicoAutenticacao autenticacao, ServicoNotas notas,
                    ServicoFaltas faltas, ServicoDashboard dashboard) throws IOException {
        this.autenticacao = autenticacao;
        this.notas = notas;
        this.faltas = faltas;
        this.dashboard = dashboard;
        this.http = HttpServer.create(new InetSocketAddress(porta), 0);
        this.http.setExecutor(Executors.newFixedThreadPool(16));
        this.http.createContext("/", this::atender);
        registrarRotas();
    }

    public void iniciar() {
        http.start();
    }

    public void parar() {
        http.stop(0);
        ((java.util.concurrent.ExecutorService) http.getExecutor()).shutdownNow();
    }

    public int porta() {
        return http.getAddress().getPort();
    }

    // ------------------------------------------------------------------ rotas

    private void registrarRotas() {
        // RF01 - autenticação e direcionamento por perfil
        rota("POST", "/api/auth/login", Acesso.PUBLICO, (r, u) -> Resposta.ok(
                autenticacao.login(Campos.texto(r.corpo(), "email"), Campos.texto(r.corpo(), "senha"))));
        rota("POST", "/api/auth/logout", Acesso.AUTENTICADO, (r, u) -> {
            autenticacao.logout(r.token());
            return new Resposta(204, null);
        });

        // RF02 - resumo da tela inicial
        rota("GET", "/api/dashboard", Acesso.AUTENTICADO, (r, u) -> Resposta.ok(dashboard.resumo(u)));

        // RF03 - aluno consulta notas por disciplina
        rota("GET", "/api/notas", Acesso.ALUNO, (r, u) -> Resposta.ok(notas.consultarDoAluno(u)));

        // RF04 - professor lança e edita notas
        rota("POST", "/api/notas", Acesso.PROFESSOR, (r, u) -> new Resposta(201, notas.lancar(u, r.corpo())));
        rota("PUT", "/api/notas/(\\d{1,9})", Acesso.PROFESSOR,
                (r, u) -> Resposta.ok(notas.editar(u, r.ids().get(0), r.corpo())));
        rota("GET", "/api/professor/turmas", Acesso.PROFESSOR, (r, u) -> Resposta.ok(notas.turmasDoProfessor(u)));
        rota("GET", "/api/professor/turmas/(\\d{1,9})/disciplinas/(\\d{1,9})/notas", Acesso.PROFESSOR,
                (r, u) -> Resposta.ok(notas.notasDaTurma(u, r.ids().get(0), r.ids().get(1))));

        // RF05 - aluno consulta faltas por disciplina
        rota("GET", "/api/faltas", Acesso.ALUNO, (r, u) -> Resposta.ok(faltas.consultarDoAluno(u)));
    }

    private void rota(String metodo, String regex, Acesso acesso, Manipulador manipulador) {
        rotas.add(new Rota(metodo, Pattern.compile(regex), acesso, manipulador));
    }

    // ------------------------------------------------------------ atendimento

    private void atender(HttpExchange troca) throws IOException {
        try (troca) {
            Resposta resposta;
            try {
                resposta = processar(troca);
            } catch (ApiException e) {
                resposta = new Resposta(e.status(), Json.obj("erro", e.getMessage()));
            } catch (RuntimeException e) {
                e.printStackTrace();
                resposta = new Resposta(500, Json.obj("erro", "Erro interno do servidor"));
            }
            enviar(troca, resposta);
        }
    }

    private Resposta processar(HttpExchange troca) throws IOException {
        String metodo = troca.getRequestMethod().toUpperCase();
        String caminho = normalizar(troca.getRequestURI().getPath());
        if (metodo.equals("OPTIONS")) {
            return new Resposta(204, null);
        }
        boolean caminhoExiste = false;
        for (Rota rota : rotas) {
            Matcher m = rota.padrao().matcher(caminho);
            if (!m.matches()) {
                continue;
            }
            caminhoExiste = true;
            if (rota.metodo().equals(metodo)) {
                return executar(rota, m, troca, metodo, caminho);
            }
        }
        throw caminhoExiste
                ? new ApiException(405, "Método não permitido")
                : new ApiException(404, "Recurso não encontrado");
    }

    private Resposta executar(Rota rota, Matcher m, HttpExchange troca, String metodo, String caminho)
            throws IOException {
        String token = extrairToken(troca);
        Usuario usuario = null;
        if (rota.acesso() != Acesso.PUBLICO) {
            usuario = autenticacao.autenticar(token);
            if (rota.acesso().perfilExigido != null) {
                autenticacao.exigirPerfil(usuario, rota.acesso().perfilExigido);
            }
        }
        Map<String, Object> corpo = metodo.equals("POST") || metodo.equals("PUT") ? lerCorpo(troca) : Map.of();
        List<Integer> ids = new ArrayList<>();
        for (int g = 1; g <= m.groupCount(); g++) {
            ids.add(Integer.parseInt(m.group(g)));
        }
        return rota.manipulador().tratar(new Requisicao(metodo, caminho, token, corpo, ids), usuario);
    }

    private static String normalizar(String caminho) {
        return caminho.length() > 1 && caminho.endsWith("/") ? caminho.substring(0, caminho.length() - 1) : caminho;
    }

    private static String extrairToken(HttpExchange troca) {
        String cabecalho = troca.getRequestHeaders().getFirst("Authorization");
        if (cabecalho != null && cabecalho.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return cabecalho.substring(7).trim();
        }
        return null;
    }

    private static Map<String, Object> lerCorpo(HttpExchange troca) throws IOException {
        byte[] bytes = troca.getRequestBody().readNBytes(LIMITE_CORPO_BYTES + 1);
        if (bytes.length > LIMITE_CORPO_BYTES) {
            throw new ApiException(413, "Corpo da requisição muito grande");
        }
        String texto = new String(bytes, StandardCharsets.UTF_8);
        if (texto.isBlank()) {
            return Map.of();
        }
        if (!(Json.ler(texto) instanceof Map<?, ?> mapa)) {
            throw new ApiException(400, "O corpo deve ser um objeto JSON");
        }
        Map<String, Object> resultado = new LinkedHashMap<>();
        mapa.forEach((k, v) -> resultado.put(String.valueOf(k), v));
        return resultado;
    }

    private static void enviar(HttpExchange troca, Resposta resposta) throws IOException {
        var cabecalhos = troca.getResponseHeaders();
        cabecalhos.set("Access-Control-Allow-Origin", "*");
        cabecalhos.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
        cabecalhos.set("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
        if (resposta.corpo() == null) {
            troca.sendResponseHeaders(resposta.status(), -1);
            return;
        }
        byte[] bytes = Json.escrever(resposta.corpo()).getBytes(StandardCharsets.UTF_8);
        cabecalhos.set("Content-Type", "application/json; charset=utf-8");
        troca.sendResponseHeaders(resposta.status(), bytes.length);
        try (OutputStream saida = troca.getResponseBody()) {
            saida.write(bytes);
        }
    }
}
