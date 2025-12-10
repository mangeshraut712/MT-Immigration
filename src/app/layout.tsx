import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { Toaster } from "@/components/ui/sonner";

import { DynamicChatBot } from "@/components/features/chatbot/DynamicChatBot";

// SF Pro alternative - Inter is the closest Google Font
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Elegant Serif for headings - Apple-like premium feel
const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "M&T Immigration Law Firm | Affordable Immigration Legal Services",
  description: "Low-bono immigration support for visitor, student, marriage-based, and humanitarian cases. Honest guidance, affordable prices.",
  keywords: ["immigration lawyer", "visa attorney", "green card", "asylum", "low-bono legal services"],
  authors: [{ name: "M&T Immigration Law Firm" }],
  openGraph: {
    title: "M&T Immigration Law Firm",
    description: "Affordable immigration legal services delivered with care.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={clsx(inter.variable, dmSerif.variable, "scroll-smooth")} suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground font-sans" suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <DynamicChatBot />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}

