package br.edu.escola.repositorio;

import br.edu.escola.modelo.Atribuicao;
import br.edu.escola.modelo.Disciplina;
import br.edu.escola.modelo.Falta;
import br.edu.escola.modelo.Matricula;
import br.edu.escola.modelo.Nota;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Turma;
import br.edu.escola.modelo.Usuario;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/** Armazenamento em memória, seguro para acesso concorrente. */
public final class Repositorio {

    private final Map<Integer, Usuario> usuarios = new ConcurrentHashMap<>();
    private final Map<Integer, Disciplina> disciplinas = new ConcurrentHashMap<>();
    private final Map<Integer, Turma> turmas = new ConcurrentHashMap<>();
    private final Map<Integer, Nota> notas = new ConcurrentHashMap<>();
    private final List<Atribuicao> atribuicoes = new CopyOnWriteArrayList<>();
    private final List<Matricula> matriculas = new CopyOnWriteArrayList<>();
    private final List<Falta> faltas = new CopyOnWriteArrayList<>();
    private final AtomicInteger sequenciaNota = new AtomicInteger();

    // ------------------------------------------------------------- cadastros

    public void adicionar(Usuario usuario) {
        usuarios.put(usuario.id(), usuario);
    }

    public void adicionar(Disciplina disciplina) {
        disciplinas.put(disciplina.id(), disciplina);
    }

    public void adicionar(Turma turma) {
        turmas.put(turma.id(), turma);
    }

    public void adicionar(Atribuicao atribuicao) {
        atribuicoes.add(atribuicao);
    }

    public void adicionar(Matricula matricula) {
        matriculas.add(matricula);
    }

    public void adicionar(Falta falta) {
        faltas.add(falta);
    }

    // -------------------------------------------------------------- consultas

    public Usuario usuarioPorId(int id) {
        return usuarios.get(id);
    }

    public Usuario usuarioPorEmail(String email) {
        return usuarios.values().stream()
                .filter(u -> u.email().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }

    public Disciplina disciplinaPorId(int id) {
        return disciplinas.get(id);
    }

    public Turma turmaPorId(int id) {
        return turmas.get(id);
    }

    public boolean alunoMatriculado(int alunoId, int turmaId) {
        return matriculas.contains(new Matricula(alunoId, turmaId));
    }

    public boolean professorLeciona(int professorId, int turmaId, int disciplinaId) {
        return atribuicoes.contains(new Atribuicao(professorId, turmaId, disciplinaId));
    }

    public List<Atribuicao> atribuicoesDoProfessor(int professorId) {
        return atribuicoes.stream()
                .filter(a -> a.professorId() == professorId)
                .sorted(Comparator.comparingInt(Atribuicao::turmaId).thenComparingInt(Atribuicao::disciplinaId))
                .toList();
    }

    public List<Usuario> alunosDaTurma(int turmaId) {
        return matriculas.stream()
                .filter(m -> m.turmaId() == turmaId)
                .map(m -> usuarios.get(m.alunoId()))
                .filter(u -> u != null && u.perfil() == Perfil.ALUNO)
                .sorted(Comparator.comparing(Usuario::nome))
                .toList();
    }

    public List<Disciplina> disciplinasDoAluno(int alunoId) {
        Set<Integer> turmasDoAluno = matriculas.stream()
                .filter(m -> m.alunoId() == alunoId)
                .map(Matricula::turmaId)
                .collect(Collectors.toSet());
        return atribuicoes.stream()
                .filter(a -> turmasDoAluno.contains(a.turmaId()))
                .map(a -> disciplinas.get(a.disciplinaId()))
                .filter(d -> d != null)
                .distinct()
                .sorted(Comparator.comparing(Disciplina::nome))
                .toList();
    }

    // ----------------------------------------------------------------- notas

    public Nota criarNota(int alunoId, int turmaId, int disciplinaId, String descricao, double valor) {
        Nota nota = new Nota(sequenciaNota.incrementAndGet(), alunoId, turmaId, disciplinaId, descricao, valor);
        notas.put(nota.id(), nota);
        return nota;
    }

    public Nota notaPorId(int id) {
        return notas.get(id);
    }

    public void atualizarNota(Nota nota) {
        notas.put(nota.id(), nota);
    }

    public List<Nota> notasDoAluno(int alunoId, int disciplinaId) {
        return notas.values().stream()
                .filter(n -> n.alunoId() == alunoId && n.disciplinaId() == disciplinaId)
                .sorted(Comparator.comparingInt(Nota::id))
                .toList();
    }

    public List<Nota> notasDaTurma(int turmaId, int disciplinaId) {
        return notas.values().stream()
                .filter(n -> n.turmaId() == turmaId && n.disciplinaId() == disciplinaId)
                .sorted(Comparator.comparingInt(Nota::id))
                .toList();
    }

    // ---------------------------------------------------------------- faltas

    public List<Falta> faltasDoAluno(int alunoId, int disciplinaId) {
        return faltas.stream()
                .filter(f -> f.alunoId() == alunoId && f.disciplinaId() == disciplinaId)
                .sorted(Comparator.comparing(Falta::data))
                .toList();
    }
}
