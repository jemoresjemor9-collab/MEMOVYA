"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type StoredFile = {
  id: string;
  object_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  folder_path: string;
  created_at: string;
};

type Usage = {
  used_bytes: number;
  reserved_bytes: number;
  quota_bytes: number;
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 o";
  const units = ["o", "Ko", "Mo", "Go", "To"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export default function FileManager() {
  const supabase = useMemo(() => createClient(), []);
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    const [fileResult, usageResult] = await Promise.all([
      supabase.from("memovya_files")
        .select("id,object_path,file_name,mime_type,size_bytes,folder_path,created_at")
        .eq("status", "ready")
        .order("created_at", { ascending: false }),
      supabase.from("memovya_storage_usage")
        .select("used_bytes,reserved_bytes,quota_bytes")
        .maybeSingle(),
    ]);

    if (fileResult.error) setError(fileResult.error.message);
    else setFiles((fileResult.data ?? []) as StoredFile[]);

    if (usageResult.error) setError(usageResult.error.message);
    else if (usageResult.data) setUsage(usageResult.data as Usage);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { void refresh(); }, [refresh]);

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setMessage("");
    if (file.size > 50 * 1024 * 1024) {
      setError("La limite actuelle est de 50 Mo par fichier sur le forfait Supabase Free.");
      return;
    }

    setUploading(true);
    let reservationId: string | null = null;
    let objectPath: string | null = null;
    let objectUploaded = false;

    try {
      const { data: reserveData, error: reserveError } = await supabase.functions.invoke("memovya-account-recovery", {
        body: {
          action: "storage-reserve",
          file_name: file.name,
          mime_type: file.type || "application/octet-stream",
          size_bytes: file.size,
          folder_path: "/",
        },
      });
      if (reserveError) throw reserveError;
      if (!reserveData?.success) throw new Error(reserveData?.error || "Réservation du stockage impossible.");

      const reservation = reserveData.reservation;
      if (!reservation?.file_id || !reservation?.object_path) {
        throw new Error("La réservation de stockage n'a pas retourné de chemin valide.");
      }
      const reservedFileId = String(reservation.file_id);
      const reservedObjectPath = String(reservation.object_path);
      reservationId = reservedFileId;
      objectPath = reservedObjectPath;

      const { error: uploadError } = await supabase.storage
        .from("memovya-private")
        .upload(reservedObjectPath, file, {
          cacheControl: "3600",
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (uploadError) throw uploadError;
      objectUploaded = true;

      const { data: completeData, error: completeError } = await supabase.functions.invoke("memovya-account-recovery", {
        body: { action: "storage-complete", file_id: reservedFileId },
      });
      if (completeError) throw completeError;
      if (!completeData?.success) throw new Error(completeData?.error || "Finalisation du fichier impossible.");

      setMessage("Fichier enregistré dans votre espace privé.");
      await refresh();
    } catch (cause) {
      if (objectUploaded && objectPath) {
        await supabase.storage.from("memovya-private").remove([objectPath]);
      }
      if (reservationId) {
        await supabase.functions.invoke("memovya-account-recovery", {
          body: { action: "storage-cancel", file_id: reservationId },
        });
      }
      setError(cause instanceof Error ? cause.message : "L'envoi du fichier a échoué.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(file: StoredFile) {
    setError("");
    const { data, error: signedError } = await supabase.storage
      .from("memovya-private")
      .createSignedUrl(file.object_path, 60);
    if (signedError || !data?.signedUrl) {
      setError(signedError?.message ?? "Impossible de préparer le téléchargement.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleDelete(file: StoredFile) {
    if (!window.confirm(`Supprimer « ${file.file_name} » de votre espace ?`)) return;
    setError("");
    const { error: storageError } = await supabase.storage
      .from("memovya-private")
      .remove([file.object_path]);
    if (storageError) {
      setError(storageError.message);
      return;
    }
    const { error: rowError } = await supabase
      .from("memovya_files")
      .delete()
      .eq("id", file.id);
    if (rowError) {
      setError(rowError.message);
      return;
    }
    setMessage("Fichier supprimé.");
    await refresh();
  }

  const used = usage?.used_bytes ?? 0;
  const reserved = usage?.reserved_bytes ?? 0;
  const quota = usage?.quota_bytes ?? 2 * 1024 * 1024 * 1024;
  const percent = Math.min(100, ((used + reserved) / quota) * 100);

  return (
    <section className="dashboard-panel file-manager">
      <div className="file-manager-head">
        <div>
          <p className="auth-kicker">STOCKAGE PRIVÉ</p>
          <h2>Mes fichiers</h2>
          <p className="auth-description">Vos fichiers sont privés et accessibles uniquement depuis votre compte.</p>
        </div>
        <label className={`upload-button${uploading ? " is-disabled" : ""}`}>
          {uploading ? "Envoi en cours…" : "＋ Ajouter un fichier"}
          <input type="file" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="usage-card">
        <div className="usage-labels">
          <strong>Espace utilisé</strong>
          <span>{formatBytes(used)} / {formatBytes(quota)}</span>
        </div>
        <div className="usage-track"><span style={{ width: `${percent}%` }} /></div>
        <p>{formatBytes(reserved)} en cours d'envoi · Limite du compte : 2 Go</p>
      </div>

      {message && <p className="storage-feedback">{message}</p>}
      {error && <p className="storage-feedback storage-error">{error}</p>}

      <div className="stored-files">
        <div className="stored-files-title">
          <h3>Fichiers enregistrés</h3>
          <button type="button" onClick={() => void refresh()} disabled={loading}>Actualiser</button>
        </div>
        {loading ? (
          <p className="empty-files">Chargement de votre espace…</p>
        ) : files.length === 0 ? (
          <p className="empty-files">Votre espace est prêt. Ajoutez votre premier fichier pour le retrouver sur vos autres appareils.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <span className="stored-file-icon" aria-hidden="true">▤</span>
                <span className="stored-file-info">
                  <strong title={file.file_name}>{file.file_name}</strong>
                  <small>{formatBytes(file.size_bytes)} · {new Date(file.created_at).toLocaleDateString("fr-FR")}</small>
                </span>
                <button type="button" onClick={() => void handleDownload(file)} aria-label={`Télécharger ${file.file_name}`}>Télécharger</button>
                <button type="button" className="delete-file" onClick={() => void handleDelete(file)} aria-label={`Supprimer ${file.file_name}`}>Supprimer</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="storage-plan-note">La capacité globale du projet Supabase Free est de 1 Go partagé entre tous les utilisateurs et la taille maximale d'un fichier est actuellement de 50 Mo. Le quota individuel de 2 Go est prêt ; le passage au forfait Pro sera nécessaire pour augmenter la capacité globale au-delà de la limite gratuite.</p>
    </section>
  );
}
