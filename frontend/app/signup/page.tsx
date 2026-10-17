import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand auth-brand" href="/"><span className="brand-mark">E</span>Educa</Link>
        <h1>Criar acesso</h1>
        <p>Preencha seus dados para solicitar acesso à plataforma.</p>
        <form className="auth-form">
          <label htmlFor="name">Nome completo</label>
          <input autoComplete="name" id="name" name="name" placeholder="Seu nome" required />
          <label htmlFor="email">E-mail institucional</label>
          <input autoComplete="email" id="email" name="email" placeholder="voce@escola.edu.br" required type="email" />
          <label htmlFor="password">Senha</label>
          <input autoComplete="new-password" id="password" name="password" placeholder="Crie uma senha" required type="password" />
          <button className="primary-button" type="submit">Solicitar acesso</button>
        </form>
        <div className="auth-foot">Já tem uma conta? <Link href="/login">Entrar</Link></div>
      </section>
    </main>
  );
}
