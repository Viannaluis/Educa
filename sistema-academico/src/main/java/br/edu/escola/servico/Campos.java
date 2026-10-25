package br.edu.escola.servico;

import br.edu.escola.erro.ApiException;
import java.util.Map;

/** Leitura validada de campos do corpo da requisição. */
public final class Campos {

    private Campos() {
    }

    public static String texto(Map<String, Object> corpo, String campo) {
        if (corpo.get(campo) instanceof String s && !s.isBlank()) {
            return s.trim();
        }
        throw new ApiException(400, "Campo '" + campo + "' é obrigatório e deve ser texto");
    }

    public static int inteiro(Map<String, Object> corpo, String campo) {
        if (corpo.get(campo) instanceof Double d
                && d == Math.rint(d)
                && d >= 1 && d <= Integer.MAX_VALUE) {
            return d.intValue();
        }
        throw new ApiException(400, "Campo '" + campo + "' é obrigatório e deve ser um inteiro positivo");
    }

    public static double numero(Map<String, Object> corpo, String campo) {
        if (corpo.get(campo) instanceof Double d) {
            return d;
        }
        throw new ApiException(400, "Campo '" + campo + "' é obrigatório e deve ser numérico");
    }
}
