"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";

interface Invite {
  name: string;
  email: string;
  addedAt: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  creator: { _id: string; username: string; name: string };
  members: Array<{
    _id: string;
    username: string;
    name: string;
    score: number;
  }>;
  invites: Invite[];
  category: string;
  totalScore: number;
  averageScore: number;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
}

export default function MyTeamsPage() {
  const router = useRouter();
  const [myTeam, setMyTeam] = useState<Team | null>(null);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Récupérer l'utilisateur actuel
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Récupérer toutes les équipes
      const teamsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const teamsData = await teamsResponse.json();

      if (teamsData.success) {
        const teams = teamsData.data;
        setAllTeams(teams);

        // Trouver mon équipe
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userTeam = teams.find((t: Team) =>
          t.members.some((m) => m._id === user.id || m._id === user._id)
        );
        setMyTeam(userTeam || null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Chargement...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-4">
            Mes Équipes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Gérez votre équipe et découvrez les autres
          </p>
        </div>

        {/* Mon Équipe */}
        {myTeam ? (
          <div className="mb-12">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              Mon Équipe
            </h2>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-indigo-500/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {myTeam.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {myTeam.description || "Aucune description"}
                  </p>
                </div>
                {myTeam.creator._id === currentUser?.id && (
                  <Link
                    href={`/teams/${myTeam._id}/edit`}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg transform hover:scale-105"
                  >
                    ✏️ Modifier
                  </Link>
                )}
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                  <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-xl font-bold">
                    {myTeam.category}
                  </span>
                  <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-xl font-bold">
                    {myTeam.totalScore} points
                  </span>
                </div>
                <div className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">
                  🔒 Assigné par l&apos;admin
                </div>
              </div>

              {/* Membres */}
              <div className="mb-6">
                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                  👥 Membres ({myTeam.members.length}/{myTeam.maxMembers})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myTeam.members.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                    >
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{member.username}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
                        {member.score} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invités */}
              {myTeam.invites && myTeam.invites.length > 0 && (
                <div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white mb-4">
                    ✉️ Invités ({myTeam.invites.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {myTeam.invites.map((invite, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl p-4"
                      >
                        <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {invite.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {invite.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {invite.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-12 text-center">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-600">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                Vous n&apos;avez pas encore d&apos;équipe
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Créez votre équipe et invitez vos collaborateurs
              </p>
              <Link
                href="/teams/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <span className="text-xl">➕</span>
                Créer une Équipe
              </Link>
            </div>
          </div>
        )}

        {/* Autres Équipes */}
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🌟</span>
            Toutes les Équipes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTeams
              .filter((team) => team._id !== myTeam?._id)
              .map((team) => {
                return (
                  <div
                    key={team._id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 rounded-full text-xs font-bold">
                        {team.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {team.description || "Aucune description"}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold">
                          👥 {team.members.length}/{team.maxMembers}
                        </span>
                        {team.invites && team.invites.length > 0 && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-xs font-bold">
                            ✉️ {team.invites.length}
                          </span>
                        )}
                      </div>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {team.totalScore} pts
                      </span>
                    </div>

                    {/* Message d'information */}
                    <div className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-semibold text-center text-sm border border-blue-300 dark:border-blue-700">
                      ℹ️ Seul l&apos;administrateur peut vous assigner à une
                      équipe
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </main>
    </div>
  );
}
