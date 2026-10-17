import Link from "next/link";
import { PageHeading } from "@/components/PageHeading";

export default function UsersPage() {
  return (
    <>
      <PageHeading
        title="Gerenciamento de usuários"
        description="Cadastre e acompanhe alunos, professores e membros da equipe."
        action={<button className="primary-button" type="button">＋ Adicionar usuário</button>}
      />
      <section className="panel">
        <div className="placeholder-toolbar">
          <input aria-label="Buscar usuários" className="search-field" placeholder="Buscar por nome ou e-mail..." />
          <Link className="text-link" href="/signup">Convidar usuário</Link>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Turma</th><th>Situação</th></tr></thead>
            <tbody>
              <tr><td>Ana Clara Lima</td><td>ana.lima@escola.edu.br</td><td>Aluna</td><td>6º Ano A</td><td><span className="status">Ativo</span></td></tr>
              <tr><td>Mariana Costa</td><td>mariana.costa@escola.edu.br</td><td>Professora</td><td>6º Ano A</td><td><span className="status">Ativo</span></td></tr>
              <tr><td>Rafael Mendes</td><td>rafael.mendes@escola.edu.br</td><td>Professor</td><td>7º Ano B</td><td><span className="status">Ativo</span></td></tr>
              <tr><td>Lucas Oliveira</td><td>lucas.oliveira@escola.edu.br</td><td>Aluno</td><td>8º Ano A</td><td><span className="status">Ativo</span></td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
