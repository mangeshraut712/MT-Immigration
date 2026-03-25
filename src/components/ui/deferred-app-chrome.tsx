"use client";

import dynamic from "next/dynamic";

const ClientEnhancements = dynamic(
  () =>
    import("@/components/ui/client-enhancements").then(
      (mod) => mod.ClientEnhancements,
    ),
  { ssr: false },
);

const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false },
);

export function DeferredAppChrome() {
  return (
    <>
      <ClientEnhancements />
      <Toaster position="bottom-right" richColors closeButton />
    </>
  );
}
