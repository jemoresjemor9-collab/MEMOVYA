import Link from "next/link";
import RecoveryForm from "@/components/recovery-form";

export const metadata = { title: "Récupérer mon compte" };

export default function RecoverPage() {
  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link href="/" className="auth-brand">
          <span className="brand-mark" aria-hidden="true">M</span>
          MEMOVYA
        </Link>
        <div className="auth-intro">
          <p className="auth-kicker">RÉCUPÉRATION SÉCURISÉE</p>
          <h1 className="auth-title">Retrouvez votre compte.</h1>
          <p className="auth-description">Utilisez votre deuxième code pour remplacer le mot de passe principal, ou votre code final pour remplacer le deuxième code.</p>
        </div>
        <RecoveryForm />
        <div className="auth-links">
          <Link href="/login">Retour à la connexion</Link>
          <Link href="/signup">Créer un compte</Link>
        </div>
      </section>
    </main>
  );
}
