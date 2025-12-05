"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userApi, User } from "@/lib/userApi";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userApi.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadData();
    // Rafraîchissement automatique toutes les 5 secondes
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const loadData = async () => {
    try {
      const [userData, usersData] = await Promise.all([
        userApi.getMe(),
        userApi.getAll(),
      ]);
      setUser(userData);
      setAllUsers(usersData);
    } catch (error) {
      console.error("Erreur:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    userApi.logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{getRankEmoji(user.position)}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mon Profil
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bienvenue, <span className="font-semibold">{user.name}</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Classement
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Carte de profil */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Position et Score */}
            <div className="text-center p-6 bg-linear-to-br from-indigo-50 to-cyan-50 dark:from-indigo-900/20 dark:to-cyan-900/20 rounded-xl">
              <div className="text-6xl mb-2">{getRankEmoji(user.position)}</div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                #{user.position || "?"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Position
              </div>
            </div>

            <div className="text-center p-6 bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-6xl mb-2">⭐</div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {user.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Points
              </div>
            </div>

            <div className="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="text-6xl mb-2">👥</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {user.team}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Équipe
              </div>
            </div>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
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
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Username
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  @{user.username}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Email
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Catégorie
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                    user.category
                  )}`}
                >
                  {user.category}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <svg
                className="h-6 w-6 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Membre depuis
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classement complet */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Classement Complet
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mise à jour automatique toutes les 5 secondes
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    Rang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    Participant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    Équipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase">
                    Catégorie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {allUsers.map((u) => (
                  <tr
                    key={u._id}
                    className={`
                      ${
                        u._id === user._id
                          ? "bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-500"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700"
                      }
                      transition-colors
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {getRankEmoji(u.position)}
                        </span>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          #{u.position}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {u.name}
                          {u._id === user._id && (
                            <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                              Vous
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{u.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {u.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {u.team}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(
                          u.category
                        )}`}
                      >
                        {u.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
