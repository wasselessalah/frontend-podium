"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants incorrects");
        setIsLoading(false);
      } else {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur est survenue");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-green-950 dark:to-emerald-950 px-4 py-12 relative overflow-hidden">
      {/* Animated Background with Eco Theme */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Floating Eco Icons */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">
          🌱
        </div>
        <div
          className="absolute top-40 right-20 text-5xl opacity-15 animate-float"
          style={{ animationDelay: "1s" }}
        >
          🌍
        </div>
        <div
          className="absolute bottom-32 left-20 text-5xl opacity-20 animate-float"
          style={{ animationDelay: "2s" }}
        >
          🌿
        </div>
        <div
          className="absolute bottom-20 right-32 text-6xl opacity-15 animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          ♻️
        </div>
        <div
          className="absolute top-60 right-40 text-5xl opacity-10 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          🌳
        </div>
      </div>

      <div className="max-w-lg w-full space-y-8 relative z-10">
        {/* Logo et titre */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <div className="mx-auto h-28 w-28 bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/50 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-white/50 dark:ring-gray-800/50 relative overflow-hidden">
              {/* Shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="text-6xl drop-shadow-2xl relative z-10">🌱</span>
            </div>
          </Link>
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🌍</span>
              <h2 className="text-5xl font-black bg-clip-text text-transparent bg-linear-to-r from-green-700 via-emerald-600 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400">
                Dashboard Admin
              </h2>
              <span className="text-2xl">🌿</span>
            </div>
            <p className="text-lg font-bold text-green-700 dark:text-green-400">
              Plateforme de Développement Durable
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Accès sécurisé réservé aux administrateurs
            </p>
          </div>
        </div>

        {/* Formulaire avec glassmorphism et thème éco */}
        <div className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 py-10 px-10 shadow-2xl rounded-3xl border-2 border-green-200/50 dark:border-green-700/50 relative overflow-hidden">
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-tr-full"></div>

          {/* Header avec icône */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">
              Authentification
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Connectez-vous pour gérer la plateforme
            </p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-700 dark:text-red-400 px-5 py-4 rounded-2xl text-sm flex items-center gap-3 animate-shake shadow-lg">
                <svg
                  className="h-6 w-6 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="username"
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-600 dark:text-green-400">👤</span>
                Nom d&apos;utilisateur
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400 group-focus-within:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-4 py-4 border-2 border-green-300 dark:border-green-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 transition-all text-base font-medium shadow-sm hover:shadow-md"
                  placeholder="Identifiant admin"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300"
              >
                <span className="text-green-600 dark:text-green-400">🔐</span>
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-green-500 dark:text-green-400 group-focus-within:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-4 py-4 border-2 border-green-300 dark:border-green-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 bg-white dark:bg-gray-700 transition-all text-base font-medium shadow-sm hover:shadow-md"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center gap-3 py-5 px-6 border border-transparent text-lg font-black rounded-2xl text-white bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white relative z-10"></div>
                    <span className="relative z-10">Connexion en cours...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl relative z-10">🌿</span>
                    <span className="relative z-10">Se connecter</span>
                    <svg
                      className="h-6 w-6 group-hover:translate-x-1 transition-transform relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Info sécurité */}
          <div className="mt-8 pt-6 border-t-2 border-green-200 dark:border-green-800 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 text-green-700 dark:text-green-400">
              <svg
                className="h-6 w-6 animate-pulse"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-black text-base">
                Connexion Sécurisée SSL
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Vos données sont protégées et chiffrées
            </p>
          </div>
        </div>

        {/* Lien retour avec design amélioré */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-green-200 dark:border-green-800">
            <span className="text-xl">🌍</span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Plateforme Éco-Responsable
            </span>
            <span className="text-xl">♻️</span>
          </div>
        </div>
      </div>
    </div>
  );
}
