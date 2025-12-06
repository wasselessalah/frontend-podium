import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Podium de Concours - BDE MIAGE PARIS CITé",
  description:
    "Application de gamification pour le classement des équipes en temps réel. Développée avec Next.js, accessible (WCAG) et éco-conçue.",
  keywords: [
    "podium",
    "classement",
    "gamification",
    "BDE",
    "MIAGE",
    "accessible",
    "WCAG",
    "développement durable",
  ],
  authors: [{ name: "BDE MIAGE PARIS CITé" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
