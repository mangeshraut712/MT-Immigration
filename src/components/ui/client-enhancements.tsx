"use client";

import { useEffect, useState } from "react";

import { ServiceWorker } from "@/components/ui/service-worker";
import { BackToTop } from "@/components/layout/BackToTop";
import { DynamicChatBot } from "@/components/features/chatbot/DynamicChatBot";

export function ClientEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let activated = false;

    const activate = () => {
      if (activated) {
        return;
      }

      activated = true;
      setReady(true);
    };

    const timeoutId = globalThis.setTimeout(activate, 5000);
    const runtimeWindow = globalThis as typeof window;
    runtimeWindow.addEventListener("pointerdown", activate, {
      once: true,
      passive: true,
    });
    runtimeWindow.addEventListener("keydown", activate, { once: true });
    runtimeWindow.addEventListener("scroll", activate, {
      once: true,
      passive: true,
    });

    return () => {
      globalThis.clearTimeout(timeoutId);
      runtimeWindow.removeEventListener("pointerdown", activate);
      runtimeWindow.removeEventListener("keydown", activate);
      runtimeWindow.removeEventListener("scroll", activate);
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <ServiceWorker />
      <BackToTop />
      <DynamicChatBot />
    </>
  );
}
