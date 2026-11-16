"use client";

import PasswordInput from "@/components/password-input";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Mode = "primary" | "secondary";

export default function RecoveryForm() {
  const [mode, setMode] = useState<Mode>("primary");
  const [email, setEmail] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 10 || newPassword !== confirmPassword) {
      setError("Le nouveau mot de passe doit contenir au moins 10 caractères et les deux saisies doivent correspondre.");
      return;
    }
    if (mode === "primary" && (!recoveryPassword || recoveryPassword === newPassword)) {
      setError("Saisissez votre mot de passe de récupération. Il doit être différent du nouveau mot de passe principal.");
      return;
    }
    if (mode === "secondary" && (finalCode.length < 12 || finalCode === newPassword)) {
      setError("Saisissez le code final d'au moins 12 caractères. Il doit être différent du nouveau mot de passe.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { data, error: invokeError } = await supabase.functions.invoke("memovya-account-recovery", {
        body: mode === "primary"
          ? { action: "recover-primary", email, recovery_password: recoveryPassword, new_password: newPassword }
          : { action: "recover-secondary", email, final_code: finalCode, new_recovery_password: newPassword },
      });
      if (invokeError) throw invokeError;
      if (!data?.success) throw new Error(data?.error || "La récupération a échoué.");
      setMessage(data.message || "Votre code a été mis à jour.");
      setRecoveryPassword("");
      setFinalCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La récupération du compte a échoué.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="recovery-switch">
        <button type="button" className={mode === "primary" ? "active" : ""} onClick={() => { setMode("primary"); setError(""); setMessage(""); }}>
          Mot de passe principal oublié
        </button>
        <button type="button" className={mode === "secondary" ? "active" : ""} onClick={() => { setMode("secondary"); setError(""); setMessage(""); }}>
          Mot de passe de récupération oublié
        </button>
      </div>

      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          Adresse e-mail du compte
          <input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required />
        </label>

        {mode === "primary" ? (
          <label className="auth-field">
            Votre mot de passe de récupération (2e code)
            <PasswordInput autoComplete="off" value={recoveryPassword} onChange={setRecoveryPassword} minLength={10} required />
          </label>
        ) : (
          <label className="auth-field">
            Votre code de récupération final (3e code)
            <PasswordInput autoComplete="off" value={finalCode} onChange={setFinalCode} minLength={12} required />
          </label>
        )}

        <label className="auth-field">
          {mode === "primary" ? "Nouveau mot de passe principal" : "Nouveau mot de passe de récupération"}
          <PasswordInput autoComplete="new-password" value={newPassword} onChange={setNewPassword} minLength={10} required />
        </label>
        <label className="auth-field">
          Confirmer le nouveau mot de passe
          <PasswordInput autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} minLength={10} required />
        </label>
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? "Vérification en cours…" : mode === "primary" ? "Récupérer mon compte" : "Remplacer le mot de passe de récupération"}
        </button>
      </form>

      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      {message && <p className="auth-message" role="status">{message}</p>}
      <p className="auth-note">
        Après 5 codes erronés, la récupération est temporairement bloquée pendant 30 minutes. Si vous perdez aussi le code final, MEMOVYA ne pourra pas récupérer le compte.
      </p>
    </>
  );
}
