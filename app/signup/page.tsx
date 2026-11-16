import Link from "next/link";
import AuthForm from "@/components/auth-form";

export const metadata = { title: "Créer un compte" };

export default function SignupPage() {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link href="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true">M</span>
          MEMOVYA
        </Link>
        <div className="auth-intro">
          <p className="auth-kicker">BIENVENUE CHEZ MEMOVYA</p>
          <h1 className="auth-title">Créez votre espace.</h1>
          <p className="auth-description">Un compte personnel pour organiser votre univers numérique.</p>
        </div>
        <AuthForm mode="signup" />
        <div className="auth-links">
          <Link href="/login">J'ai déjà un compte</Link>
          <Link href="/">Retour à l'accueil</Link>
        </div>
        <p className="auth-note">La confirmation par e-mail est désactivée pour le moment. Créez votre compte avec votre adresse et un mot de passe personnel.</p>
      </section>
    </main>
  );
}
