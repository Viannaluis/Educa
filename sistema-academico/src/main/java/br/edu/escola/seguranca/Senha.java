package br.edu.escola.seguranca;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/** Hash de senhas com PBKDF2 (nunca armazena senha em texto puro). */
public final class Senha {

    private static final int ITERACOES = 120_000;
    private static final int BITS = 256;
    private static final SecureRandom ALEATORIO = new SecureRandom();

    private Senha() {
    }

    public static String novoSalt() {
        byte[] bytes = new byte[16];
        ALEATORIO.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    public static String hash(String senha, String salt) {
        try {
            PBEKeySpec spec = new PBEKeySpec(senha.toCharArray(), Base64.getDecoder().decode(salt), ITERACOES, BITS);
            byte[] derivado = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
            return Base64.getEncoder().encodeToString(derivado);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("PBKDF2 indisponível", e);
        }
    }

    public static boolean confere(String senha, String salt, String hashEsperado) {
        byte[] calculado = hash(senha, salt).getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(calculado, hashEsperado.getBytes(StandardCharsets.UTF_8));
    }
}
