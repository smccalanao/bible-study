"use client";

import { useEffect } from "react";
import { BASE_PATH, withBase } from "@/lib/basePath";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const swUrl = withBase("/sw.js");
        const scope = `${BASE_PATH}/` || "/";
        await navigator.serviceWorker.register(swUrl, { scope });
      } catch {
        // Ignore registration errors in unsupported environments
      }
    };

    register();
  }, []);

  return null;
}
