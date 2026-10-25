package br.edu.escola.servico;

import static br.edu.escola.util.Json.obj;

import br.edu.escola.modelo.Atribuicao;
import br.edu.escola.modelo.Disciplina;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.repositorio.Repositorio;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/** RF02 - resumo das informações relevantes para a tela inicial de cada perfil. */
public final class ServicoDashboard {

    private final Repositorio repo;
    private final ServicoNotas notas;
    private final ServicoFaltas faltas;

    public ServicoDashboard(Repositorio repo, ServicoNotas notas, ServicoFaltas faltas) {
        this.repo = repo;
        this.notas = notas;
        this.faltas = faltas;
    }

    public Map<String, Object> resumo(Usuario usuario) {
        return usuario.perfil() == Perfil.ALUNO ? resumoAluno(usuario) : resumoProfessor(usuario);
    }

    private Map<String, Object> resumoAluno(Usuario aluno) {
        List<Map<String, Object>> porDisciplina = new ArrayList<>();
        double somaMedias = 0;
        int comMedia = 0;
        int totalFaltas = 0;
        for (Disciplina d : repo.disciplinasDoAluno(aluno.id())) {
            Double media = notas.mediaDoAluno(aluno.id(), d.id());
            int faltasDisciplina = faltas.totalFaltas(aluno.id(), d.id());
            if (media != null) {
                somaMedias += media;
                comMedia++;
            }
            totalFaltas += faltasDisciplina;
            porDisciplina.add(obj("disciplina", d.nome(), "media", media, "faltas", faltasDisciplina));
        }
        Double mediaGeral = comMedia == 0 ? null : ServicoNotas.arredondar(somaMedias / comMedia);
        return obj(
                "perfil", aluno.perfil(),
                "nome", aluno.nome(),
                "totalDisciplinas", porDisciplina.size(),
                "mediaGeral", mediaGeral,
                "totalFaltas", totalFaltas,
                "disciplinas", porDisciplina);
    }

    private Map<String, Object> resumoProfessor(Usuario professor) {
        Set<Integer> turmas = new HashSet<>();
        Set<Integer> alunos = new HashSet<>();
        List<Atribuicao> atribuicoes = repo.atribuicoesDoProfessor(professor.id());
        for (Atribuicao a : atribuicoes) {
            turmas.add(a.turmaId());
            repo.alunosDaTurma(a.turmaId()).forEach(u -> alunos.add(u.id()));
        }
        return obj(
                "perfil", professor.perfil(),
                "nome", professor.nome(),
                "totalTurmas", turmas.size(),
                "totalDisciplinas", atribuicoes.size(),
                "totalAlunos", alunos.size(),
                "notasLancadas", notas.totalNotasLancadas(professor));
    }
}
