# Educa
Site escolar para apresentação.

## Execução

```sh
pnpm install
pnpm dev:front
```

## API demonstrativa

O backend está implementado como Route Handlers do Next.js, dentro de `frontend/app/api`.
As rotas seguem o envelope JSON `{ "success": true, "data": ... }` em caso de sucesso
e `{ "success": false, "error": { "message": ... } }` em caso de erro.

Rotas disponíveis:

- `GET /api/perfil?perfil=aluno|professor`
- `GET /api/dashboard?perfil=aluno|professor`
- `GET /api/notas?perfil=aluno` (perfil professor recebe `403`)
- `GET /api/faltas?perfil=aluno`
- `GET /api/turmas` e `GET /api/turmas/{id}/alunos`
- `POST /api/turmas/{id}/notas`
- `POST /api/turmas/{id}/frequencia`
- `GET /api/grade?perfil=aluno|professor`
- `GET /api/calendario?tipo=Avaliação&turmaId=8A`

O envio de notas espera `{ "subject": "Matemática", "assessment": "Prova bimestral", "grades": [{ "studentId": "2026001", "score": 8.5 }] }`.
O registro de frequência espera `{ "subject": "Matemática", "date": "2026-10-26", "lesson": "1ª aula", "absentStudentIds": ["2026001"] }`.
Notas aceitam valores de 0 a 10; matrículas precisam pertencer à turma informada.

Os dados são fictícios e ficam somente na memória do processo: não há banco, gravação
persistente, sessão ou autenticação. O parâmetro `perfil` serve apenas para demonstração,
não para controle de acesso. As rotas de escrita validam os dados e atualizam o estado
temporário; as alterações se perdem ao reiniciar o servidor. A camada de dados pode ser
substituída quando a persistência for implementada.
