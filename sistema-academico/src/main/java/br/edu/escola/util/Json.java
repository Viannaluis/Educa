package br.edu.escola.util;

import br.edu.escola.erro.ApiException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Leitor/escritor JSON mínimo, sem dependências externas. */
public final class Json {

    private static final int PROFUNDIDADE_MAXIMA = 64;

    private Json() {
    }

    /** Cria um objeto JSON preservando a ordem: obj("chave", valor, "chave2", valor2). */
    public static Map<String, Object> obj(Object... paresChaveValor) {
        if (paresChaveValor.length % 2 != 0) {
            throw new IllegalArgumentException("Esperado número par de argumentos");
        }
        Map<String, Object> mapa = new LinkedHashMap<>();
        for (int i = 0; i < paresChaveValor.length; i += 2) {
            mapa.put((String) paresChaveValor[i], paresChaveValor[i + 1]);
        }
        return mapa;
    }

    public static String escrever(Object valor) {
        StringBuilder sb = new StringBuilder();
        escrever(valor, sb);
        return sb.toString();
    }

    public static Object ler(String texto) {
        return new Leitor(texto).documento();
    }

    // ---------------------------------------------------------------- escrita

    private static void escrever(Object valor, StringBuilder sb) {
        if (valor == null) {
            sb.append("null");
        } else if (valor instanceof String || valor instanceof Enum<?> || valor instanceof LocalDate) {
            aspas(valor.toString(), sb);
        } else if (valor instanceof Number || valor instanceof Boolean) {
            sb.append(valor);
        } else if (valor instanceof Map<?, ?> mapa) {
            sb.append('{');
            boolean primeiro = true;
            for (Map.Entry<?, ?> e : mapa.entrySet()) {
                if (!primeiro) {
                    sb.append(',');
                }
                primeiro = false;
                aspas(String.valueOf(e.getKey()), sb);
                sb.append(':');
                escrever(e.getValue(), sb);
            }
            sb.append('}');
        } else if (valor instanceof Collection<?> colecao) {
            sb.append('[');
            boolean primeiro = true;
            for (Object item : colecao) {
                if (!primeiro) {
                    sb.append(',');
                }
                primeiro = false;
                escrever(item, sb);
            }
            sb.append(']');
        } else {
            throw new IllegalArgumentException("Tipo não suportado: " + valor.getClass());
        }
    }

    private static void aspas(String texto, StringBuilder sb) {
        sb.append('"');
        for (int i = 0; i < texto.length(); i++) {
            char c = texto.charAt(i);
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        sb.append('"');
    }

    // ---------------------------------------------------------------- leitura

    private static final class Leitor {
        private final String s;
        private int i;
        private int profundidade;

        Leitor(String s) {
            this.s = s;
        }

        Object documento() {
            espaco();
            Object valor = valor();
            espaco();
            if (i < s.length()) {
                throw falha();
            }
            return valor;
        }

        private ApiException falha() {
            return new ApiException(400, "JSON inválido");
        }

        private void espaco() {
            while (i < s.length() && Character.isWhitespace(s.charAt(i))) {
                i++;
            }
        }

        private boolean proximoE(char c) {
            return i < s.length() && s.charAt(i) == c;
        }

        private void esperar(char c) {
            if (!proximoE(c)) {
                throw falha();
            }
            i++;
        }

        private void literal(String palavra) {
            if (!s.startsWith(palavra, i)) {
                throw falha();
            }
            i += palavra.length();
        }

        private Object valor() {
            if (i >= s.length()) {
                throw falha();
            }
            switch (s.charAt(i)) {
                case '{':
                    return objeto();
                case '[':
                    return lista();
                case '"':
                    return texto();
                case 't':
                    literal("true");
                    return Boolean.TRUE;
                case 'f':
                    literal("false");
                    return Boolean.FALSE;
                case 'n':
                    literal("null");
                    return null;
                default:
                    return numero();
            }
        }

        private Map<String, Object> objeto() {
            entrar();
            i++;
            Map<String, Object> mapa = new LinkedHashMap<>();
            espaco();
            if (proximoE('}')) {
                i++;
                sair();
                return mapa;
            }
            while (true) {
                espaco();
                if (!proximoE('"')) {
                    throw falha();
                }
                String chave = texto();
                espaco();
                esperar(':');
                espaco();
                mapa.put(chave, valor());
                espaco();
                if (proximoE(',')) {
                    i++;
                    continue;
                }
                esperar('}');
                sair();
                return mapa;
            }
        }

        private List<Object> lista() {
            entrar();
            i++;
            List<Object> itens = new ArrayList<>();
            espaco();
            if (proximoE(']')) {
                i++;
                sair();
                return itens;
            }
            while (true) {
                espaco();
                itens.add(valor());
                espaco();
                if (proximoE(',')) {
                    i++;
                    continue;
                }
                esperar(']');
                sair();
                return itens;
            }
        }

        private String texto() {
            i++;
            StringBuilder sb = new StringBuilder();
            while (true) {
                if (i >= s.length()) {
                    throw falha();
                }
                char c = s.charAt(i++);
                if (c == '"') {
                    return sb.toString();
                }
                if (c < 0x20) {
                    throw falha();
                }
                if (c != '\\') {
                    sb.append(c);
                    continue;
                }
                if (i >= s.length()) {
                    throw falha();
                }
                char e = s.charAt(i++);
                switch (e) {
                    case '"', '\\', '/' -> sb.append(e);
                    case 'b' -> sb.append('\b');
                    case 'f' -> sb.append('\f');
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case 'u' -> {
                        if (i + 4 > s.length()) {
                            throw falha();
                        }
                        try {
                            sb.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                        } catch (NumberFormatException ex) {
                            throw falha();
                        }
                        i += 4;
                    }
                    default -> throw falha();
                }
            }
        }

        private Double numero() {
            int inicio = i;
            while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) {
                i++;
            }
            if (inicio == i) {
                throw falha();
            }
            try {
                double d = Double.parseDouble(s.substring(inicio, i));
                if (!Double.isFinite(d)) {
                    throw falha();
                }
                return d;
            } catch (NumberFormatException e) {
                throw falha();
            }
        }

        private void entrar() {
            if (++profundidade > PROFUNDIDADE_MAXIMA) {
                throw falha();
            }
        }

        private void sair() {
            profundidade--;
        }
    }
}
