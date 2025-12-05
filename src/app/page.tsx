"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  score: number;
  category: string;
  position: number | null;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  creator: { username: string; name: string } | null;
  members: Array<{ username: string; name: string; score: number }>;
  category: string;
  totalScore: number;
  averageScore: number;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [top3Users, setTop3Users] = useState<User[]>([]);
  const [top3Teams, setTop3Teams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"users" | "teams">("teams");

  // Rediriger vers le login admin
  useEffect(() => {
    router.push("/admin/login");
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les équipes
      const teamsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams${
          selectedCategory !== "all" ? `?category=${selectedCategory}` : ""
        }`
      );
      const teamsData = await teamsResponse.json();

      // Récupérer les utilisateurs
      const usersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users${
          selectedCategory !== "all" ? `?category=${selectedCategory}` : ""
        }`
      );
      const usersData = await usersResponse.json();

      if (teamsData.success) {
        const sortedTeams = [...teamsData.data].sort(
          (a, b) => b.totalScore - a.totalScore
        );
        setTeams(sortedTeams);
        setTop3Teams(sortedTeams.slice(0, 3));
      }

      if (usersData.success) {
        const sortedUsers = [...usersData.data].sort(
          (a, b) => b.score - a.score
        );
        setUsers(sortedUsers);
        setTop3Users(sortedUsers.slice(0, 3));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const getRankEmoji = (position: number) => {
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

      {/* Hero Section */}
      <header className="relative overflow-hidden">
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
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 animate-ping opacity-20">
                  <div className="text-8xl">🏆</div>
                </div>
                <div className="relative text-8xl animate-bounce">🏆</div>
              </div>

              <h1 className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Classement{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-600">
                  en Direct
                </span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Suivez les performances des équipes et participants en temps
                réel.
                <br className="hidden sm:block" />
                <span className="inline-flex items-center gap-2 mt-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Mise à jour automatique toutes les 10 secondes
                </span>
              </p>

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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setViewMode("teams")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              viewMode === "teams"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            👥 Équipes
          </button>
          <button
            onClick={() => setViewMode("users")}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              viewMode === "users"
                ? "bg-indigo-600 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            👤 Individuel
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["all", "Tech", "Design", "Marketing", "Business"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
              }`}
            >
              {cat === "all" ? "🌍 Toutes" : `${getCategoryIcon(cat)} ${cat}`}
            </button>
          ))}
        </div>

        {/* Podium Section */}
        {viewMode === "teams" ? (
          <>
            {/* Top 3 Teams Podium */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row items-end justify-center gap-8 mb-12">
                {/* Position 2 - Argent (à gauche) */}
                {top3Teams[1] && (
                  <div className="relative order-2 md:order-1">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-gray-300 hover:scale-105 transition-transform">
                      <div className="text-6xl mb-4 text-center">🥈</div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
                        {top3Teams[1].name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                        {top3Teams[1].members.length} membres
                      </p>
                      <div className="flex justify-center mb-4">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                            top3Teams[1].category
                          )}`}
                        >
                          {top3Teams[1].category}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                          {top3Teams[1].totalScore}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          points
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Position 1 - Or (au centre, plus grand) */}
                {top3Teams[0] && (
                  <div
                    className="relative order-1 md:order-2 scale-110 md:scale-110 z-10"
                    style={{ transform: "scale(1.1) translateY(-20px)" }}
                  >
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-yellow-400 hover:scale-105 transition-transform">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-4xl font-black text-yellow-500">
                        🏆 Top 3 Équipes
                      </div>
                      <div className="text-6xl mb-4 text-center mt-4">🥇</div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
                        {top3Teams[0].name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                        {top3Teams[0].members.length} membres
                      </p>
                      <div className="flex justify-center mb-4">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                            top3Teams[0].category
                          )}`}
                        >
                          {top3Teams[0].category}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                          {top3Teams[0].totalScore}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          points
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Position 3 - Bronze (à droite) */}
                {top3Teams[2] && (
                  <div className="relative order-3 md:order-3">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 border-orange-400 hover:scale-105 transition-transform">
                      <div className="text-6xl mb-4 text-center">🥉</div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
                        {top3Teams[2].name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                        {top3Teams[2].members.length} membres
                      </p>
                      <div className="flex justify-center mb-4">
                        <span
                          className={`px-4 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                            top3Teams[2].category
                          )}`}
                        >
                          {top3Teams[2].category}
                        </span>
                      </div>
                      <div className="text-center">
                        <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                          {top3Teams[2].totalScore}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          points
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All Teams List */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-6 bg-linear-to-r from-indigo-500 to-purple-500">
                <h2 className="text-3xl font-black text-white">
                  📊 Classement Complet
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {teams.map((team, index) => (
                  <div
                    key={team._id}
                    className="px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-4xl font-black text-gray-400 dark:text-gray-500 w-12 text-center">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {team.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                                team.category
                              )}`}
                            >
                              {team.category}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              👥 {team.members.length} membres
                            </span>
                            {team.creator && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                👑 {team.creator.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                          {team.totalScore}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          points
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Top 3 Users Podium */}
            <div className="mb-16">
              <h2 className="text-4xl font-black text-center text-gray-900 dark:text-white mb-12">
                🌟 Top 3 Individuel
              </h2>
              <div className="flex flex-col md:flex-row items-end justify-center gap-8 mb-12">
                {[1, 0, 2].map((idx) => {
                  const user = top3Users[idx];
                  if (!user) return null;
                  const position = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                  return (
                    <div
                      key={user._id}
                      className={`relative ${
                        position === 1
                          ? "order-1 md:order-2 scale-110 md:scale-110 z-10"
                          : position === 2
                          ? "order-2 md:order-1"
                          : "order-3 md:order-3"
                      }`}
                      style={{
                        transform:
                          position === 1 ? "scale(1.1) translateY(-20px)" : "",
                      }}
                    >
                      <div
                        className={`bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 ${
                          position === 1
                            ? "border-yellow-400"
                            : position === 2
                            ? "border-gray-300"
                            : "border-orange-400"
                        } hover:scale-105 transition-transform`}
                      >
                        <div className="text-6xl mb-4 text-center">
                          {getRankEmoji(position)}
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                          @{user.username}
                        </p>
                        <div className="flex justify-center mb-4">
                          <span
                            className={`px-4 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                              user.category
                            )}`}
                          >
                            {user.category}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                            {user.score}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            points
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Users List */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
              <div className="px-8 py-6 bg-linear-to-r from-indigo-500 to-purple-500">
                <h2 className="text-3xl font-black text-white">
                  📊 Classement Complet
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user, index) => (
                  <div
                    key={user._id}
                    className="px-8 py-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="text-4xl font-black text-gray-400 dark:text-gray-500 w-12 text-center">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              @{user.username}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getCategoryColor(
                                user.category
                              )}`}
                            >
                              {user.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                          {user.score}
                        </span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          points
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function getCategoryIcon(category: string) {
  const icons = {
    Tech: "💻",
    Design: "🎨",
    Marketing: "📢",
    Business: "💼",
  };
  return icons[category as keyof typeof icons] || "📁";
}
