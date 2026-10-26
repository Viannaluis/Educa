package br.edu.escola.servico;

import static br.edu.escola.util.Json.obj;

import br.edu.escola.erro.ApiException;
import br.edu.escola.modelo.Perfil;
import br.edu.escola.modelo.Usuario;
import br.edu.escola.repositorio.Repositorio;
import br.edu.escola.seguranca.Senha;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** RF01 - autentica o usuário e indica a interface correspondente ao perfil. */
public final class ServicoAutenticacao {

    private static final Duration VALIDADE = Duration.ofHours(2);
    private static final String SALT_FICTICIO = Senha.novoSalt();

    private record Sessao(int usuarioId, Instant expiraEm) {
    }

    private final Repositorio repo;
    private final SecureRandom aleatorio = new SecureRandom();
    private final Map<String, Sessao> sessoes = new ConcurrentHashMap<>();

    public ServicoAutenticacao(Repositorio repo) {
        this.repo = repo;
    }

    public Map<String, Object> login(String email, String senha) {
        Usuario usuario = repo.usuarioPorEmail(email);
        if (usuario == null) {
            Senha.hash(senha, SALT_FICTICIO); // mantém o tempo de resposta semelhante
            throw credenciaisInvalidas();
        }
        if (!Senha.confere(senha, usuario.salt(), usuario.senhaHash())) {
            throw credenciaisInvalidas();
        }
        String token = novoToken();
        Instant expiraEm = Instant.now().plus(VALIDADE);
        sessoes.put(token, new Sessao(usuario.id(), expiraEm));
        String destino = usuario.perfil() == Perfil.ALUNO ? "/aluno/inicio" : "/professor/inicio";
        return obj(
                "token", token,
                "expiraEm", expiraEm.toString(),
                "usuario", obj("id", usuario.id(), "nome", usuario.nome(), "perfil", usuario.perfil()),
                "redirecionarPara", destino);
    }

    public Usuario autenticar(String token) {
        if (token == null || token.isBlank()) {
            throw new ApiException(401, "Autenticação necessária");
        }
        Sessao sessao = sessoes.get(token);
        if (sessao == null) {
            throw new ApiException(401, "Sessão inválida");
        }
        if (Instant.now().isAfter(sessao.expiraEm())) {
            sessoes.remove(token);
            throw new ApiException(401, "Sessão expirada");
        }
        Usuario usuario = repo.usuarioPorId(sessao.usuarioId());
        if (usuario == null) {
            sessoes.remove(token);
            throw new ApiException(401, "Sessão inválida");
        }
        return usuario;
    }

    public void exigirPerfil(Usuario usuario, Perfil perfil) {
        if (usuario.perfil() != perfil) {
            throw new ApiException(403, "Acesso negado para o seu perfil");
        }
    }

    public void logout(String token) {
        if (token != null) {
            sessoes.remove(token);
        }
    }

    private String novoToken() {
        byte[] bytes = new byte[32];
        aleatorio.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private ApiException credenciaisInvalidas() {
        return new ApiException(401, "E-mail ou senha inválidos");
    }
}
