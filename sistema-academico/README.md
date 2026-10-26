# Backend – Sistema Acadêmico (RF01 a RF05)

Java 17+ puro (sem Maven/Gradle e sem bibliotecas externas). Dados em memória, já populados para demonstração.

## Como usar
    ./executar.sh          # compila e sobe em http://localhost:8080 (ou PORT / primeiro argumento)
    ./testar.sh            # teste de integração (41 verificações)

## Usuários de demonstração
| Perfil    | E-mail             | Senha    | Observação |
|-----------|--------------------|----------|------------|
| Aluno     | ana@escola.com     | aluno123 | |
| Aluno     | bruno@escola.com   | aluno123 | |
| Professor | carlos@escola.com  | prof123  | Matemática e Português – 1º Ano A |
| Professor | marina@escola.com  | prof123  | História – 1º Ano A |

## Endpoints (enviar `Authorization: Bearer <token>`)
| Req  | Método e rota | Perfil |
|------|---------------|--------|
| RF01 | `POST /api/auth/login` `{email, senha}` → token + `redirecionarPara` | público |
| RF01 | `POST /api/auth/logout` | autenticado |
| RF02 | `GET /api/dashboard` | aluno e professor |
| RF03 | `GET /api/notas` (notas e média por disciplina) | aluno |
| RF04 | `POST /api/notas` `{alunoId, turmaId, disciplinaId, descricao, valor}` | professor |
| RF04 | `PUT /api/notas/{id}` `{valor, descricao?}` | professor |
| RF04 | `GET /api/professor/turmas` e `GET /api/professor/turmas/{t}/disciplinas/{d}/notas` | professor |
| RF05 | `GET /api/faltas` (total, justificadas e registros por disciplina) | aluno |

Regras: nota entre 0 e 10; professor só lança/edita em turma+disciplina a que está vinculado; aluno precisa estar matriculado na turma; senhas com PBKDF2; sessão expira em 2 h.
Erros: 400 (requisição inválida), 401, 403, 404, 405, 422 (regra de negócio), 500.

## Estrutura
`modelo` · `repositorio` · `servico` (regras dos RFs) · `web` (HTTP) · `seguranca` · `util` · `erro`
