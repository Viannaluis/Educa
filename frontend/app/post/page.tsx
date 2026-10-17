import { PageHeading } from "@/components/PageHeading";

export default function PostsPage() {
  return (
    <>
      <PageHeading
        title="Comunicados"
        description="Compartilhe avisos, atividades e novidades com a comunidade escolar."
        action={<button className="primary-button" type="button">＋ Novo comunicado</button>}
      />
      <section className="placeholder-card">
        <h2>Bem-vindo ao mural da escola</h2>
        <p>Os comunicados publicados para alunos, responsáveis e professores aparecerão aqui.</p>
      </section>
    </>
  );
}
