import Link from "next/link";
import AuthForm from "@/components/auth-form";

export const metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link href="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true">M</span>
          MEMOVYA
        </Link>
        <div className="auth-intro">
          <p className="auth-kicker">VOTRE ESPACE PERSONNEL</p>
          <h1 className="auth-title">Heureux de vous retrouver.</h1>
          <p className="auth-description">Connectez-vous pour retrouver votre espace numérique.</p>
        </div>
        <AuthForm mode="login" />
        <div className="auth-links">
          <Link href="/signup">Créer un compte</Link>
          <span aria-label="Réinitialisation bientôt disponible" style={{color:"#8A95A7"}}>Mot de passe oublié ? (bientôt)</span>
        </div>
      </section>
    </main>
  );
}
