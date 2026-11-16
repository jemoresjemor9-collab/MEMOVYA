"use client";

import PasswordInput from "@/components/password-input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RecoverySetup() {
  const router = useRouter();
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [confirmRecoveryPassword, setConfirmRecoveryPassword] = useState("");
  const [finalCode, setFinalCode] = useState("");
  const [confirmFinalCode, setConfirmFinalCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (recoveryPassword.length < 10 || recoveryPassword !== confirmRecoveryPassword) {
      setError("Le deuxième mot de passe doit contenir au moins 10 caractères et les deux saisies doivent correspondre.");
      return;
    }
    if (finalCode.length < 12 || /\s/.test(finalCode) || finalCode !== confirmFinalCode || finalCode === recoveryPassword) {
      setError("Le code final doit contenir au moins 12 caractères, être confirmé et être différent du deuxième mot de passe.");
      return;
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: invokeError } = await supabase.functions.invoke("memovya-account-recovery", {
        body: { action: "setup", recovery_password: recoveryPassword, final_code: finalCode },
      });
      if (invokeError) throw invokeError;
      await supabase.auth.refreshSession();
      router.replace("/dashboard");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Impossible d'enregistrer vos codes de récupération.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      {error && <p className="auth-message auth-error" role="alert">{error}</p>}
      <label className="auth-field">
        Mot de passe de récupération (2e code)
        <PasswordInput autoComplete="new-password" value={recoveryPassword} onChange={setRecoveryPassword} minLength={10} required />
      </label>
      <label className="auth-field">
        Confirmer le 2e code
        <PasswordInput autoComplete="new-password" value={confirmRecoveryPassword} onChange={setConfirmRecoveryPassword} minLength={10} required />
      </label>
      <label className="auth-field">
        Code de récupération final (3e code)
        <PasswordInput autoComplete="new-password" value={finalCode} onChange={setFinalCode} minLength={12} required />
      </label>
      <label className="auth-field">
        Confirmer le code final
        <PasswordInput autoComplete="new-password" value={confirmFinalCode} onChange={setConfirmFinalCode} minLength={12} required />
      </label>
      <p className="recovery-warning">Le 2e code permet de remplacer le mot de passe principal. Le 3e code permet de remplacer le 2e. Si vous perdez les trois, le compte ne pourra plus être récupéré.</p>
      <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Enregistrement…" : "Enregistrer mes codes et continuer"}</button>
    </form>
  );
}
