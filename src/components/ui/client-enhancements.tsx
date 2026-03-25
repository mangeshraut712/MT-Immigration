"use client";

import { useEffect, useState } from "react";

import { Analytics } from "@/components/ui/analytics";
import { WebVitals } from "@/components/ui/web-vitals";
import { ServiceWorker } from "@/components/ui/service-worker";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/layout/BackToTop";
import { DynamicChatBot } from "@/components/features/chatbot/DynamicChatBot";

export function ClientEnhancements() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleCallbackId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const runtimeWindow = globalThis as typeof window;

    if ("requestIdleCallback" in runtimeWindow) {
      idleCallbackId = runtimeWindow.requestIdleCallback(() => setReady(true), {
        timeout: 2000,
      });
    } else {
      timeoutId = globalThis.setTimeout(() => setReady(true), 1200);
    }

    return () => {
      if (timeoutId !== null) {
        globalThis.clearTimeout(timeoutId);
      }
      if (idleCallbackId !== null) {
        runtimeWindow.cancelIdleCallback(idleCallbackId);
      }
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <WebVitals />
      <Analytics />
      <ServiceWorker />
      <ScrollProgress />
      <BackToTop />
      <DynamicChatBot />
    </>
  );
}
