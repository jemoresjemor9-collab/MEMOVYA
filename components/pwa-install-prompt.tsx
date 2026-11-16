"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [help, setHelp] = useState("");

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(isStandalone);
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
      setHelp("MEMOVYA est installée sur cet appareil.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (promptEvent) {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") setHelp("Installation lancée. Retrouvez MEMOVYA parmi vos applications.");
      setPromptEvent(null);
      return;
    }
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setHelp(isIOS
      ? "Sur iPhone/iPad : ouvrez Partager dans Safari, puis choisissez « Sur l’écran d’accueil »."
      : "Ouvrez le menu de votre navigateur (⋮ ou …), puis choisissez « Installer MEMOVYA » ou « Ajouter à l’écran d’accueil ».");
  }

  if (installed) return <p className="install-status">✓ MEMOVYA est installée</p>;
  return (
    <div className="install-area">
      <button className="install-button" type="button" onClick={install}>
        <span aria-hidden="true">↓</span> Installer MEMOVYA
      </button>
      {help && <p className="install-help" role="status">{help}</p>}
    </div>
  );
}
