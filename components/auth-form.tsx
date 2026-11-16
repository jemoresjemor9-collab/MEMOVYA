"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { mode: "login" | "signup" };

export default function AuthForm({ mode }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Saisissez une adresse e-mail valide.");
      return;
    }

    if (mode === "signup") {
      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        setError("Renseignez votre prénom et votre nom de famille.");
        return;
      }
      if (password.length < 10) {
        setError("Le mot de passe doit contenir au moins 10 caractères.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Les deux mots de passe ne correspondent pas.");
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              first_name: cleanFirstName,
              last_name: cleanLastName,
              full_name: `${cleanFirstName} ${cleanLastName}`,
              description: description.trim() || null,
            },
          },
        });

        if (authError) throw authError;
        if (data.session) {
          router.replace("/dashboard");
          router.refresh();
          return;
        }

        setError(
          "Le compte a été créé, mais Supabase n'a pas ouvert de session. La confirmation par e-mail doit être désactivée dans les paramètres Auth de MEMOVYA. Aucun e-mail de confirmation ne doit être nécessaire."
        );
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
      if (message.includes("Invalid login credentials")) {
        setError("Adresse e-mail ou mot de passe incorrect.");
      } else if (message.toLowerCase().includes("already registered")) {
        setError("Cette adresse e-mail possède déjà un compte. Connectez-vous plutôt.");
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleBusy(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { prompt: "select_account" },
        },
      });
      if (oauthError) throw oauthError;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Connexion Google impossible.";
      setError(
        message.toLowerCase().includes("provider")
          ? "La connexion Google est prête dans l'application, mais le fournisseur Google doit encore être activé et configuré dans Supabase."
          : message
      );
      setGoogleBusy(false);
    }
  }

  return (
    <>
      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <>
            <label className="auth-field">
              Prénom
              <input
                autoComplete="given-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                maxLength={60}
                required
              />
            </label>
            <label className="auth-field">
              Nom de famille
              <input
                autoComplete="family-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                maxLength={80}
                required
              />
            </label>
          </>
        )}
        <label className="auth-field">
          Adresse e-mail
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={254}
            required
          />
        </label>
        <label className="auth-field">
          Mot de passe
          <input
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={mode === "signup" ? 10 : undefined}
            required
          />
        </label>
        {mode === "signup" && (
          <>
            <label className="auth-field">
              Confirmer le mot de passe
              <input
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={10}
                required
              />
            </label>
            <label className="auth-field">
              Pourquoi souhaitez-vous utiliser MEMOVYA ? <span>(facultatif)</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Présentez brièvement votre besoin…"
              />
            </label>
          </>
        )}
        <button className="auth-submit" type="submit" disabled={busy || googleBusy}>
          {busy ? "Création en cours…" : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
      </form>
      <div className="auth-divider">OU</div>
      <button
        className="auth-google"
        type="button"
        onClick={handleGoogle}
        disabled={busy || googleBusy}
      >
        <span aria-hidden="true">G</span>
        {googleBusy ? "Redirection vers Google…" : "Continuer avec Google"}
      </button>
    </>
  );
}
