"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { mode: "login" | "signup" };

export default function AuthForm({ mode }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (mode === "signup" && fullName.trim().length < 2) {
      setError("Saisissez votre nom (au moins 2 caractères).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Saisissez une adresse email valide.");
      return;
    }
    if (password.length < 10) {
      setError("Le mot de passe doit contenir au moins 10 caractères.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (authError) throw authError;
        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }
        setMessage("Le compte a été créé, mais aucune session n'a été ouverte. La confirmation email est probablement encore activée dans Supabase : elle doit être désactivée pour respecter le fonctionnement provisoire sans email.");
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (authError) throw authError;
        router.replace("/dashboard");
        router.refresh();
        return;
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Une erreur inattendue est survenue.";
      setError(message.includes("Invalid login credentials")
        ? "Adresse email ou mot de passe incorrect."
        : message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {message && <p className="auth-message" role="status">{message}</p>}
      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <label className="auth-field">
            Nom complet
            <input autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} required />
          </label>
        )}
        <label className="auth-field">
          Adresse email
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required />
        </label>
        <label className="auth-field">
          Mot de passe
          <input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={10} required />
        </label>
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? "Veuillez patienter…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
      <div className="auth-divider">OU</div>
      <button className="auth-google" type="button" disabled title="La configuration Google OAuth sera activée dans une prochaine étape">
        Continuer avec Google — bientôt disponible
      </button>
    </>
  );
}
