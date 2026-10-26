package br.edu.escola;

import br.edu.escola.repositorio.DadosIniciais;
import br.edu.escola.repositorio.Repositorio;
import br.edu.escola.servico.ServicoAutenticacao;
import br.edu.escola.servico.ServicoDashboard;
import br.edu.escola.servico.ServicoFaltas;
import br.edu.escola.servico.ServicoNotas;
import br.edu.escola.web.Servidor;
import java.io.IOException;

public final class Main {

    private Main() {
    }

    public static void main(String[] args) throws IOException {
        int porta = args.length > 0 ? Integer.parseInt(args[0]) : portaDoAmbiente();
        Servidor servidor = criarServidor(porta);
        servidor.iniciar();
        System.out.println("API no ar em http://localhost:" + servidor.porta());
    }

    /** Monta toda a aplicação (usado também pelos testes). */
    public static Servidor criarServidor(int porta) throws IOException {
        Repositorio repo = new Repositorio();
        DadosIniciais.carregar(repo);
        ServicoNotas notas = new ServicoNotas(repo);
        ServicoFaltas faltas = new ServicoFaltas(repo);
        return new Servidor(porta, new ServicoAutenticacao(repo), notas, faltas,
                new ServicoDashboard(repo, notas, faltas));
    }

    private static int portaDoAmbiente() {
        String valor = System.getenv("PORT");
        return valor == null || valor.isBlank() ? 8080 : Integer.parseInt(valor.trim());
    }
}
