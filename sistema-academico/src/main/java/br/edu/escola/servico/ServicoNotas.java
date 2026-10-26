package br.edu.escola.servico;

import static br.edu.escola.util.Json.obj;

import br.edu.escola.erro.ApiException;
import br.edu.escola.modelo.Atribuicao;
import br.edu.escola.modelo.Disciplina;
import br.edu.escola.modelo.Nota;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.repositorio.Repositorio;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** RF03 (aluno consulta notas) e RF04 (professor lança e edita notas). */
public final class ServicoNotas {

    private static final double NOTA_MINIMA = 0.0;
    private static final double NOTA_MAXIMA = 10.0;

    private final Repositorio repo;

    public ServicoNotas(Repositorio repo) {
        this.repo = repo;
    }

    // ------------------------------------------------------------------ RF03

    public List<Map<String, Object>> consultarDoAluno(Usuario aluno) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Disciplina disciplina : repo.disciplinasDoAluno(aluno.id())) {
            List<Nota> notas = repo.notasDoAluno(aluno.id(), disciplina.id());
            resultado.add(obj(
                    "disciplina", obj("id", disciplina.id(), "nome", disciplina.nome()),
                    "notas", notas.stream().map(this::paraJson).toList(),
                    "media", media(notas)));
        }
        return resultado;
    }

    /** Média das notas do aluno na disciplina, ou null se ainda não há notas. */
    public Double mediaDoAluno(int alunoId, int disciplinaId) {
        return media(repo.notasDoAluno(alunoId, disciplinaId));
    }

    // ------------------------------------------------------------------ RF04

    public Map<String, Object> lancar(Usuario professor, Map<String, Object> corpo) {
        int alunoId = Campos.inteiro(corpo, "alunoId");
        int turmaId = Campos.inteiro(corpo, "turmaId");
        int disciplinaId = Campos.inteiro(corpo, "disciplinaId");
        String descricao = Campos.texto(corpo, "descricao");
        double valor = validarValor(Campos.numero(corpo, "valor"));

        exigirVinculo(professor, turmaId, disciplinaId);
        Usuario aluno = repo.usuarioPorId(alunoId);
        if (aluno == null || aluno.perfil() != Perfil.ALUNO || !repo.alunoMatriculado(alunoId, turmaId)) {
            throw new ApiException(422, "O aluno informado não pertence à turma");
        }
        return paraJson(repo.criarNota(alunoId, turmaId, disciplinaId, descricao, valor));
    }

    public Map<String, Object> editar(Usuario professor, int notaId, Map<String, Object> corpo) {
        Nota atual = repo.notaPorId(notaId);
        if (atual == null) {
            throw new ApiException(404, "Nota não encontrada");
        }
        exigirVinculo(professor, atual.turmaId(), atual.disciplinaId());

        double valor = validarValor(Campos.numero(corpo, "valor"));
        String descricao = corpo.containsKey("descricao") ? Campos.texto(corpo, "descricao") : atual.descricao();

        Nota atualizada = new Nota(atual.id(), atual.alunoId(), atual.turmaId(), atual.disciplinaId(), descricao, valor);
        repo.atualizarNota(atualizada);
        return paraJson(atualizada);
    }

    /** Turmas/disciplinas do professor com seus alunos (necessário para saber os ids a usar no lançamento). */
    public List<Map<String, Object>> turmasDoProfessor(Usuario professor) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Atribuicao a : repo.atribuicoesDoProfessor(professor.id())) {
            resultado.add(obj(
                    "turma", obj("id", a.turmaId(), "nome", repo.turmaPorId(a.turmaId()).nome()),
                    "disciplina", obj("id", a.disciplinaId(), "nome", repo.disciplinaPorId(a.disciplinaId()).nome()),
                    "alunos", repo.alunosDaTurma(a.turmaId()).stream()
                            .map(u -> obj("id", u.id(), "nome", u.nome()))
                            .toList()));
        }
        return resultado;
    }

    public List<Map<String, Object>> notasDaTurma(Usuario professor, int turmaId, int disciplinaId) {
        exigirVinculo(professor, turmaId, disciplinaId);
        List<Nota> notas = repo.notasDaTurma(turmaId, disciplinaId);
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Usuario aluno : repo.alunosDaTurma(turmaId)) {
            List<Nota> doAluno = notas.stream().filter(n -> n.alunoId() == aluno.id()).toList();
            resultado.add(obj(
                    "aluno", obj("id", aluno.id(), "nome", aluno.nome()),
                    "notas", doAluno.stream().map(this::paraJson).toList(),
                    "media", media(doAluno)));
        }
        return resultado;
    }

    public int totalNotasLancadas(Usuario professor) {
        return repo.atribuicoesDoProfessor(professor.id()).stream()
                .mapToInt(a -> repo.notasDaTurma(a.turmaId(), a.disciplinaId()).size())
                .sum();
    }

    // --------------------------------------------------------------- internos

    private void exigirVinculo(Usuario professor, int turmaId, int disciplinaId) {
        if (!repo.professorLeciona(professor.id(), turmaId, disciplinaId)) {
            throw new ApiException(403, "Você não leciona esta disciplina nesta turma");
        }
    }

    private double validarValor(double valor) {
        if (valor < NOTA_MINIMA || valor > NOTA_MAXIMA) {
            throw new ApiException(422, "A nota deve estar entre 0 e 10");
        }
        return arredondar(valor);
    }

    private Double media(List<Nota> notas) {
        return notas.isEmpty() ? null : arredondar(notas.stream().mapToDouble(Nota::valor).average().orElse(0));
    }

    static double arredondar(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }

    private Map<String, Object> paraJson(Nota nota) {
        return obj(
                "id", nota.id(),
                "alunoId", nota.alunoId(),
                "turmaId", nota.turmaId(),
                "disciplinaId", nota.disciplinaId(),
                "descricao", nota.descricao(),
                "valor", nota.valor());
    }
}
