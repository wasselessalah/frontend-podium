import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  viewport: "width=device-width, initial-scale=1",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
