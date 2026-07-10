"use client";

import { useEffect } from "react";
import { BASE_PATH, withBase } from "@/lib/basePath";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const swUrl = withBase("/sw.js");
        const scope = BASE_PATH ? `${BASE_PATH}/` : "/";
        const reg = await navigator.serviceWorker.register(swUrl, {
          scope,
          updateViaCache: "none",
        });
        await reg.update();
      } catch {
        // Ignore registration errors in unsupported environments
      }
    };

    register();
  }, []);

  return null;
}
