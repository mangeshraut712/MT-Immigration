import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "M&T Immigration Law Firm",
    description: "Boutique U.S. immigration representation for visitor, student, family, humanitarian, and urgent court-related matters.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}