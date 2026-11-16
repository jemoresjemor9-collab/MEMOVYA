import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FileManager from "@/components/file-manager";

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
      <FileManager />
    </main>
  );
}
