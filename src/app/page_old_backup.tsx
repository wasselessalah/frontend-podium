"use client";

import { useState, useEffect, useCallback } from "react";
import { userApi, User } from "@/lib/userApi";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [top3, setTop3] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fonction pour charger les données
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [allUsers, top3Users] = await Promise.all([
        userApi.getAll(
          selectedCategory === "all" ? undefined : selectedCategory
        ),
        userApi.getTop3(
          selectedCategory === "all" ? undefined : selectedCategory
        ),
      ]);

      setUsers(allUsers);
      setTop3(top3Users);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Chargement initial et mise à jour automatique
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getRankEmoji = (position: number | null) => {
    if (!position) return "⭐";
    if (position === 1) return "🥇";
    if (position === 2) return "🥈";
    if (position === 3) return "🥉";
    return "🏅";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Tech: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      Design:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      Marketing:
        "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200",
      Business:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    };
    return colors[category as keyof typeof colors] || colors.Tech;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
              Chargement du classement...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Erreur de connexion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      {/* Hero Section with Glassmorphism */}
      <header className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="text-center">
              {/* Trophy with Animation */}
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div className="text-8xl">🏆</div>
                </div>
                <div className="relative text-8xl animate-bounce">🏆</div>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Classement{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600">
                    en Direct
                  </span>
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Suivez les performances des participants en temps réel.{" "}
                <br className="hidden sm:block" />
                <span className="inline-flex items-center gap-2 mt-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Mise à jour automatique toutes les 10 secondes
                </span>
              </p>

              {/* CTA Buttons with Modern Design */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  href="/login"
                  className="group relative px-8 py-4 bg-linear-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Voir mon profil
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Rejoindre la compétition
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter with Modern Design */}
        <div className="mb-12 flex justify-center">
          <div className="inline-flex rounded-2xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-1.5 shadow-lg">
            {["all", "Tech", "Design", "Marketing", "Business"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                {cat === "all" ? "Tous" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium - Modern Card Design */}
        {top3.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                🏆 Top 3 Podium
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Les meilleurs performers du moment
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-end gap-6 md:gap-8">
              {/* 2nd Place - Silver */}
              {top3[1] && (
                <div className="w-full sm:w-72 group">
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-gray-300 dark:border-gray-600 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Rank Badge */}
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-gray-400 to-gray-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <span className="text-2xl">🥈</span>
                      <span>2ème Place</span>
                    </div>
                    <div className="text-center mt-4">
                      <div className="w-24 h-24 mx-auto mb-4 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center text-4xl shadow-inner">
                        #{top3[1].position}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {top3[1].name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="text-4xl font-black bg-linear-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                          {top3[1].score}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          points
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                        🏢 {top3[1].team}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${getCategoryColor(
                          top3[1].category
                        )}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {top3[1].category}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1st Place - Gold */}
              {top3[0] && (
                <div className="w-full sm:w-80 group order-first sm:order-0">
                  <div className="relative bg-linear-to-br from-yellow-50 via-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:via-yellow-800/30 dark:to-amber-800/30 rounded-3xl p-10 shadow-3xl border-4 border-yellow-400 dark:border-yellow-600 hover:shadow-4xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    {/* Crown Badge */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse"></div>
                        <div className="relative bg-linear-to-r from-yellow-400 via-yellow-500 to-amber-500 text-white px-8 py-3 rounded-full text-base font-black shadow-2xl flex items-center gap-2">
                          <span className="text-3xl animate-bounce">👑</span>
                          <span>CHAMPION</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center mt-6">
                      <div className="w-32 h-32 mx-auto mb-6 bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-5xl shadow-2xl ring-4 ring-yellow-200 dark:ring-yellow-700 relative">
                        <div className="absolute inset-0 bg-linear-to-br from-yellow-400 to-amber-600 rounded-full animate-ping opacity-20"></div>
                        <span className="relative font-black text-white drop-shadow-lg">
                          #{top3[0].position}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black text-gray-900 dark:text-yellow-100 mb-3 group-hover:scale-105 transition-transform">
                        {top3[0].name}
                      </h3>
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="text-5xl font-black bg-linear-to-r from-yellow-600 via-amber-600 to-orange-600 text-transparent bg-clip-text">
                          {top3[0].score}
                        </div>
                        <span className="text-yellow-700 dark:text-yellow-300 font-bold text-lg">
                          pts
                        </span>
                      </div>
                      <p className="text-base text-gray-800 dark:text-yellow-200 mb-4 font-semibold">
                        🏢 {top3[0].team}
                      </p>
                      <span
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold ${getCategoryColor(
                          top3[0].category
                        )} ring-2 ring-offset-2 ring-yellow-400 dark:ring-yellow-600`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {top3[0].category}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3rd Place - Bronze */}
              {top3[2] && (
                <div className="w-full sm:w-72 group">
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border-2 border-orange-300 dark:border-orange-600 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
                    {/* Rank Badge */}
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-linear-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <span className="text-2xl">🥉</span>
                      <span>3ème Place</span>
                    </div>
                    <div className="text-center mt-4">
                      <div className="w-24 h-24 mx-auto mb-4 bg-linear-to-br from-orange-200 to-orange-300 dark:from-orange-600 dark:to-orange-700 rounded-full flex items-center justify-center text-4xl shadow-inner">
                        #{top3[2].position}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {top3[2].name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="text-4xl font-black bg-linear-to-r from-orange-600 to-red-600 text-transparent bg-clip-text">
                          {top3[2].score}
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          points
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
                        🏢 {top3[2].team}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ${getCategoryColor(
                          top3[2].category
                        )}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {top3[2].category}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Complete Rankings */}
        {users.length > 3 && (
          <section>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              📊 Classement Complet
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Rang
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Participant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Équipe
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                        Catégorie
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.slice(3).map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {getRankEmoji(user.position)}
                            </span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              #{user.position}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {user.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {user.team}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(
                              user.category
                            )}`}
                          >
                            {user.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Statistics */}
        <aside className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            📈 Statistiques
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {users.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Participants
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {users.reduce((sum, u) => sum + u.score, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Points totaux
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                {users[0]?.score || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Meilleur score
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {Math.round(
                  users.reduce((sum, u) => sum + u.score, 0) / users.length
                ) || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Moyenne
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg mt-12 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              🌱 Conçu avec des pratiques de développement durable et accessible
              (WCAG 2.1)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              © 2025 Podium Challenge - Tous droits réservés
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
