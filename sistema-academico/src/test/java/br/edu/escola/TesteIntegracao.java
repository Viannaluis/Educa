package br.edu.escola;

import br.edu.escola.util.Json;
import br.edu.escola.web.Servidor;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

/** Teste de integração sem framework: sobe a API e valida RF01 a RF05 e regras de acesso. */
public final class TesteIntegracao {

    private static int total;
    private static int falhas;
    private static final HttpClient CLIENTE = HttpClient.newHttpClient();
    private static String base;

    private record Resp(int status, Object json) {
        Map<?, ?> mapa() {
            return (Map<?, ?>) json;
        }

        List<?> lista() {
            return (List<?>) json;
        }
    }

    public static void main(String[] args) throws Exception {
        Servidor servidor = Main.criarServidor(0);
        servidor.iniciar();
        base = "http://localhost:" + servidor.porta();
        try {
            executar();
        } finally {
            servidor.parar();
        }
        System.out.println(total + " verificações, " + falhas + " falha(s)");
        System.exit(falhas == 0 ? 0 : 1);
    }

    private static void executar() throws Exception {
        // RF01
        confere("login com senha errada -> 401", enviar("POST", "/api/auth/login", null,
                "{\"email\":\"ana@escola.com\",\"senha\":\"errada\"}").status(), 401);
        confere("login sem corpo -> 400", enviar("POST", "/api/auth/login", null, null).status(), 400);
        confere("JSON malformado -> 400", enviar("POST", "/api/auth/login", null, "{oops").status(), 400);

        Resp loginAluno = enviar("POST", "/api/auth/login", null, "{\"email\":\"ana@escola.com\",\"senha\":\"aluno123\"}");
        confere("login aluno -> 200", loginAluno.status(), 200);
        confere("aluno redirecionado", loginAluno.mapa().get("redirecionarPara"), "/aluno/inicio");
        String aluno = (String) loginAluno.mapa().get("token");

        Resp loginProf = enviar("POST", "/api/auth/login", null, "{\"email\":\"carlos@escola.com\",\"senha\":\"prof123\"}");
        confere("professor redirecionado", loginProf.mapa().get("redirecionarPara"), "/professor/inicio");
        String prof = (String) loginProf.mapa().get("token");

        String outroProf = (String) enviar("POST", "/api/auth/login", null,
                "{\"email\":\"marina@escola.com\",\"senha\":\"prof123\"}").mapa().get("token");

        confere("sem token -> 401", enviar("GET", "/api/dashboard", null, null).status(), 401);
        confere("token inválido -> 401", enviar("GET", "/api/dashboard", "xxx", null).status(), 401);
        confere("rota inexistente -> 404", enviar("GET", "/api/nada", aluno, null).status(), 404);
        confere("método errado -> 405", enviar("DELETE", "/api/notas", aluno, null).status(), 405);

        // RF02
        Resp dashAluno = enviar("GET", "/api/dashboard", aluno, null);
        confere("dashboard aluno -> 200", dashAluno.status(), 200);
        confere("dashboard aluno: disciplinas", dashAluno.mapa().get("totalDisciplinas"), 3);
        confere("dashboard aluno: faltas", dashAluno.mapa().get("totalFaltas"), 3);
        confere("dashboard aluno: média geral", ((Number) dashAluno.mapa().get("mediaGeral")).doubleValue(), 7.88);
        Resp dashProf = enviar("GET", "/api/dashboard", prof, null);
        confere("dashboard professor: alunos", dashProf.mapa().get("totalAlunos"), 2);
        confere("dashboard professor: notas lançadas", dashProf.mapa().get("notasLancadas"), 4);

        // RF03
        Resp notas = enviar("GET", "/api/notas", aluno, null);
        confere("notas do aluno -> 200", notas.status(), 200);
        confere("notas: 3 disciplinas", notas.lista().size(), 3);
        confere("professor em /api/notas -> 403", enviar("GET", "/api/notas", prof, null).status(), 403);

        // RF04
        String nova = "{\"alunoId\":3,\"turmaId\":1,\"disciplinaId\":1,\"descricao\":\"Prova 2\",\"valor\":7.5}";
        Resp criada = enviar("POST", "/api/notas", prof, nova);
        confere("lançar nota -> 201", criada.status(), 201);
        int id = ((Number) criada.mapa().get("id")).intValue();
        confere("aluno não lança nota -> 403", enviar("POST", "/api/notas", aluno, nova).status(), 403);
        confere("professor sem vínculo -> 403", enviar("POST", "/api/notas", outroProf, nova).status(), 403);
        confere("nota 11 -> 422", enviar("POST", "/api/notas", prof,
                nova.replace("7.5", "11")).status(), 422);
        confere("nota negativa -> 422", enviar("POST", "/api/notas", prof,
                nova.replace("7.5", "-1")).status(), 422);
        confere("aluno de fora da turma -> 422", enviar("POST", "/api/notas", prof,
                nova.replace("\"alunoId\":3", "\"alunoId\":1")).status(), 422);
        confere("campo faltando -> 400", enviar("POST", "/api/notas", prof,
                "{\"alunoId\":3,\"turmaId\":1,\"disciplinaId\":1,\"valor\":5}").status(), 400);
        confere("valor como texto -> 400", enviar("POST", "/api/notas", prof,
                nova.replace("7.5", "\"7.5\"")).status(), 400);

        confere("editar nota -> 200", enviar("PUT", "/api/notas/" + id, prof, "{\"valor\":9.5}").status(), 200);
        confere("editar sem vínculo -> 403", enviar("PUT", "/api/notas/" + id, outroProf, "{\"valor\":1}").status(), 403);
        confere("editar inexistente -> 404", enviar("PUT", "/api/notas/9999", prof, "{\"valor\":1}").status(), 404);
        confere("editar valor inválido -> 422", enviar("PUT", "/api/notas/" + id, prof, "{\"valor\":10.5}").status(), 422);

        Map<?, ?> matematica = (Map<?, ?>) enviar("GET", "/api/notas", aluno, null).lista().get(1); // ordem alfabética: História, Matemática, Português
        confere("aluno vê nota editada (média)", ((Number) matematica.get("media")).doubleValue(), 9.0);

        Resp turmas = enviar("GET", "/api/professor/turmas", prof, null);
        confere("turmas do professor", turmas.lista().size(), 2);
        Resp notasTurma = enviar("GET", "/api/professor/turmas/1/disciplinas/1/notas", prof, null);
        confere("notas da turma -> 200", notasTurma.status(), 200);
        confere("notas da turma sem vínculo -> 403",
                enviar("GET", "/api/professor/turmas/1/disciplinas/3/notas", prof, null).status(), 403);

        // RF05
        Resp faltas = enviar("GET", "/api/faltas", aluno, null);
        confere("faltas -> 200", faltas.status(), 200);
        Map<?, ?> faltasMat = (Map<?, ?>) faltas.lista().get(1);
        confere("faltas matemática", faltasMat.get("totalFaltas"), 2);
        confere("faltas justificadas", faltasMat.get("justificadas"), 1);
        confere("professor em /api/faltas -> 403", enviar("GET", "/api/faltas", prof, null).status(), 403);

        // Logout
        confere("logout -> 204", enviar("POST", "/api/auth/logout", aluno, null).status(), 204);
        confere("token após logout -> 401", enviar("GET", "/api/faltas", aluno, null).status(), 401);
    }

    private static Resp enviar(String metodo, String caminho, String token, String corpo) throws Exception {
        HttpRequest.Builder b = HttpRequest.newBuilder(URI.create(base + caminho));
        if (token != null) {
            b.header("Authorization", "Bearer " + token);
        }
        HttpRequest.BodyPublisher pub = corpo == null
                ? HttpRequest.BodyPublishers.noBody()
                : HttpRequest.BodyPublishers.ofString(corpo);
        HttpResponse<String> r = CLIENTE.send(b.method(metodo, pub).build(), HttpResponse.BodyHandlers.ofString());
        Object json = r.body().isBlank() ? null : Json.ler(r.body());
        return new Resp(r.statusCode(), json);
    }

    private static void confere(String nome, Object obtido, Object esperado) {
        total++;
        boolean igual = obtido instanceof Number a && esperado instanceof Number b
                ? a.doubleValue() == b.doubleValue()
                : java.util.Objects.equals(obtido, esperado);
        if (!igual) {
            falhas++;
            System.out.println("FALHOU: " + nome + " (esperado=" + esperado + ", obtido=" + obtido + ")");
        }
    }
}
