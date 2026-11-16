import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Mon espace" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) redirect("/login");
  const email = typeof data.claims.email === "string" ? data.claims.email : "Compte Memovya";

  return (
    <main className="dashboard-shell">
      <header className="dashboard-head">
        <Link href="/" className="auth-brand"><span className="brand-mark" aria-hidden="true">M</span> MEMOVYA</Link>
        <form action="/auth/signout" method="post">
          <button className="button-secondary" type="submit">Se déconnecter</button>
        </form>
      </header>
      <section className="dashboard-welcome">
        <p className="auth-kicker">VOTRE ESPACE PERSONNEL</p>
        <h1 className="auth-title">Bienvenue sur Memovya.</h1>
        <p className="auth-description">Connecté avec <strong>{email}</strong></p>
      </section>
      <section className="dashboard-panel">
        <h2 style={{fontFamily:"Manrope",fontSize:20,marginBottom:8}}>Votre espace se prépare</h2>
        <p className="auth-description">Votre authentification est en place. Nous préparons maintenant la base de données, les permissions privées et le stockage sécurisé avant d'autoriser l'ajout de fichiers.</p>
        <div className="dashboard-placeholder">
          <div className="dashboard-tile"><span>☁️</span><strong>Stockage</strong><span>Activation après sécurisation</span></div>
          <div className="dashboard-tile"><span>📁</span><strong>Dossiers</strong><span>Organisation à venir</span></div>
          <div className="dashboard-tile"><span>🔒</span><strong>Coffre privé</strong><span>Protection en préparation</span></div>
        </div>
      </section>
    </main>
  );
}
