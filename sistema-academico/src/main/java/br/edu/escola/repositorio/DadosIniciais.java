package br.edu.escola.repositorio;

import br.edu.escola.modelo.Atribuicao;
import br.edu.escola.modelo.Disciplina;
import br.edu.escola.modelo.Falta;
import br.edu.escola.modelo.Matricula;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Turma;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.seguranca.Senha;
import java.time.LocalDate;

/** Dados de demonstração para uso imediato da API. */
public final class DadosIniciais {

    private DadosIniciais() {
    }

    public static void carregar(Repositorio repo) {
        repo.adicionar(new Disciplina(1, "Matemática"));
        repo.adicionar(new Disciplina(2, "Português"));
        repo.adicionar(new Disciplina(3, "História"));
        repo.adicionar(new Turma(1, "1º Ano A"));

        repo.adicionar(usuario(1, "Carlos Souza", "carlos@escola.com", "prof123", Perfil.PROFESSOR));
        repo.adicionar(usuario(2, "Marina Lima", "marina@escola.com", "prof123", Perfil.PROFESSOR));
        repo.adicionar(usuario(3, "Ana Pereira", "ana@escola.com", "aluno123", Perfil.ALUNO));
        repo.adicionar(usuario(4, "Bruno Alves", "bruno@escola.com", "aluno123", Perfil.ALUNO));

        repo.adicionar(new Atribuicao(1, 1, 1));
        repo.adicionar(new Atribuicao(1, 1, 2));
        repo.adicionar(new Atribuicao(2, 1, 3));
        repo.adicionar(new Matricula(3, 1));
        repo.adicionar(new Matricula(4, 1));

        repo.criarNota(3, 1, 1, "Prova 1", 8.5);
        repo.criarNota(3, 1, 1, "Trabalho", 9.0);
        repo.criarNota(3, 1, 2, "Prova 1", 7.0);
        repo.criarNota(4, 1, 1, "Prova 1", 6.5);

        repo.adicionar(new Falta(3, 1, LocalDate.of(2026, 9, 3), false));
        repo.adicionar(new Falta(3, 1, LocalDate.of(2026, 9, 17), true));
        repo.adicionar(new Falta(3, 3, LocalDate.of(2026, 10, 1), false));
        repo.adicionar(new Falta(4, 2, LocalDate.of(2026, 9, 10), false));
    }

    private static Usuario usuario(int id, String nome, String email, String senha, Perfil perfil) {
        String salt = Senha.novoSalt();
        return new Usuario(id, nome, email, salt, Senha.hash(senha, salt), perfil);
    }
}
