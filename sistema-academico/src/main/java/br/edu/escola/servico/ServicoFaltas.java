package br.edu.escola.servico;

import static br.edu.escola.util.Json.obj;

import br.edu.escola.modelo.Disciplina;
import br.edu.escola.modelo.Falta;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.repositorio.Repositorio;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** RF05 - aluno consulta suas faltas por disciplina. */
public final class ServicoFaltas {

    private final Repositorio repo;

    public ServicoFaltas(Repositorio repo) {
        this.repo = repo;
    }

    public List<Map<String, Object>> consultarDoAluno(Usuario aluno) {
        List<Map<String, Object>> resultado = new ArrayList<>();
        for (Disciplina disciplina : repo.disciplinasDoAluno(aluno.id())) {
            List<Falta> faltas = repo.faltasDoAluno(aluno.id(), disciplina.id());
            long justificadas = faltas.stream().filter(Falta::justificada).count();
            resultado.add(obj(
                    "disciplina", obj("id", disciplina.id(), "nome", disciplina.nome()),
                    "totalFaltas", faltas.size(),
                    "justificadas", justificadas,
                    "injustificadas", faltas.size() - justificadas,
                    "registros", faltas.stream()
                            .map(f -> obj("data", f.data(), "justificada", f.justificada()))
                            .toList()));
        }
        return resultado;
    }

    public int totalFaltas(int alunoId, int disciplinaId) {
        return repo.faltasDoAluno(alunoId, disciplinaId).size();
    }
}
