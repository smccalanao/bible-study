"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    ("standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [installed, setInstalled] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [iosDevice, setIosDevice] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setIosDevice(isIos());

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const onInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
      return;
    }
    if (iosDevice) setShowIosHelp((v) => !v);
  };

  // Chrome/Edge: show when prompt is available. iOS: always offer help.
  if (!deferred && !iosDevice) return null;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onInstall}
        className="w-full rounded-2xl border border-accent/30 bg-accent-soft px-4 py-3 text-left transition hover:border-accent/50"
      >
        <p className="text-sm font-semibold text-accent">Install Bible Study</p>
        <p className="mt-0.5 text-xs text-ink-soft">
          {iosDevice
            ? "Add to your Home Screen for quick access"
            : "Install as an app (not just a shortcut) — works offline"}
        </p>
      </button>

      {showIosHelp && (
        <div className="rounded-2xl border border-line bg-paper-elevated px-4 py-3 text-sm text-ink-soft">
          <p className="font-medium text-ink">On iPhone / iPad:</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Tap the Share button in Safari</li>
            <li>Scroll and tap <span className="font-medium text-ink">Add to Home Screen</span></li>
            <li>Tap <span className="font-medium text-ink">Add</span></li>
          </ol>
        </div>
      )}
    </div>
  );
}
