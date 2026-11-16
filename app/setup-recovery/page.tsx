import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RecoverySetup from "@/components/recovery-setup";

export const metadata = { title: "Sécuriser mon compte" };

export default async function SetupRecoveryPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) redirect("/login");

  return (
    <main className="auth-screen">
      <section className="auth-card">
        <Link href="/" className="auth-brand"><span className="brand-mark" aria-hidden="true">M</span> MEMOVYA</Link>
        <div className="auth-intro">
          <p className="auth-kicker">PROTECTION DU COMPTE</p>
          <h1 className="auth-title">Configurez vos codes de récupération.</h1>
          <p className="auth-description">Avant d'ouvrir votre espace, définissez le deuxième mot de passe et le code final. Ils seront nécessaires si vous oubliez vos codes précédents.</p>
        </div>
        <RecoverySetup />
      </section>
    </main>
  );
}
