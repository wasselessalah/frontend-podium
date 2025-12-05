"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Invite {
  name: string;
  email: string;
  addedAt: string;
}

interface Team {
  _id: string;
  name: string;
  description: string;
  creator: { username: string; name: string } | null;
  members: Array<{ username: string; name: string; score: number }>;
  invites: Invite[];
  category: string;
  totalScore: number;
  averageScore: number;
  maxMembers: number;
  isActive: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  team?: { _id: string; name: string } | null;
  score: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [scoreInput, setScoreInput] = useState<number>(0);
  const [viewTeamModal, setViewTeamModal] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<"teams" | "users">("teams");
  const [editingScoreTeamId, setEditingScoreTeamId] = useState<string | null>(
    null
  );
  const [tempScore, setTempScore] = useState<number>(0);
  const [assignUserModal, setAssignUserModal] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [selectedTeamForAssign, setSelectedTeamForAssign] =
    useState<string>("");
  const [editingUserScoreId, setEditingUserScoreId] = useState<string | null>(
    null
  );
  const [tempUserScore, setTempUserScore] = useState<number>(0);
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    category: "Tech",
    maxMembers: 10,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  const fetchTeams = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`);
      const data = await response.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchTeams();
      fetchUsers();
      // Rafraîchissement temps réel toutes les 3 secondes
      const interval = setInterval(() => {
        fetchTeams();
        fetchUsers();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleUpdateScore = async (teamId: string, newScore: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: newScore }),
        }
      );

      if (response.ok) {
        fetchTeams();
        setSelectedTeam(null);
        setScoreInput(0);
        setEditingScoreTeamId(null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleQuickScoreUpdate = async (teamId: string, newScore: number) => {
    if (newScore < 0) return;
    await handleUpdateScore(teamId, newScore);
  };

  const handleAssignUserToTeam = async () => {
    if (!assignUserModal || !selectedTeamForAssign) {
      alert("❌ Veuillez sélectionner une équipe");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${assignUserModal.userId}/assign-team`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teamId: selectedTeamForAssign }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`✅ ${assignUserModal.userName} a été assigné à l'équipe !`);
        setAssignUserModal(null);
        setSelectedTeamForAssign("");
        fetchUsers();
        fetchTeams();
      } else {
        alert(`❌ ${data.error || "Erreur lors de l'assignation"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur lors de l'assignation");
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (
      !confirm(`Êtes-vous sûr de vouloir supprimer l'équipe "${teamName}" ?`)
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchTeams();
        setViewTeamModal(null);
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  // Modifier le score d'un utilisateur avec +/-
  const handleQuickUserScoreUpdate = async (
    userId: string,
    currentScore: number,
    delta: number
  ) => {
    const newScore = Math.max(0, currentScore + delta);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: newScore }),
        }
      );

      if (response.ok) {
        fetchUsers();
        fetchTeams(); // Recalculer les scores des équipes
      } else {
        alert("Erreur lors de la mise à jour du score");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  // Édition inline du score utilisateur
  const handleUserScoreEdit = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/score`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score: tempUserScore }),
        }
      );

      if (response.ok) {
        setEditingUserScoreId(null);
        fetchUsers();
        fetchTeams();
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    }
  };

  // Créer une nouvelle équipe
  const handleCreateTeam = async () => {
    if (!newTeam.name.trim()) {
      alert("⚠️ Le nom de l'équipe est obligatoire");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTeam,
          isAdminCreate: true, // Flag pour indiquer que c'est une création admin
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(`✅ Équipe "${newTeam.name}" créée avec succès !`);
        setCreateTeamModal(false);
        setNewTeam({
          name: "",
          description: "",
          category: "Tech",
          maxMembers: 10,
        });
        fetchTeams();
      } else {
        alert(`❌ ${data.error || "Erreur lors de la création"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("❌ Erreur de connexion");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-green-950 dark:to-emerald-950">
      {/* Header Amélioré */}
      <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border-b-2 border-green-300/50 dark:border-green-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              {/* Logo animé */}
              <div className="relative group">
                <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-16 h-16 bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 ring-2 ring-white/50 dark:ring-gray-800/50">
                  <span className="text-3xl drop-shadow-2xl">🌱</span>
                </div>
              </div>

              {/* Titres */}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-green-700 via-emerald-600 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400">
                    Dashboard Admin
                  </h1>
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm font-bold text-green-700 dark:text-green-400">
                    Développement Durable
                  </p>
                  <span className="text-green-600 dark:text-green-400">•</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full text-xs font-black shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                    </span>
                    EN DIRECT
                  </span>
                </div>
              </div>
            </div>

            {/* User info + Déconnexion */}
            <div className="flex items-center gap-4">
              <div className="text-right bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">👤</span>
                  {session?.user?.name}
                </p>
                <p className="text-xs font-bold text-green-700 dark:text-green-400 flex items-center gap-1">
                  <span>🛡️</span>
                  Administrateur
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="group px-5 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-black transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center gap-2"
              >
                <svg
                  className="h-5 w-5 group-hover:rotate-12 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  🌍 Équipes Durables
                </p>
                <p className="text-3xl font-black text-green-600 dark:text-green-400">
                  {teams.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🌳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-emerald-200 dark:border-emerald-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  ♻️ Éco-Citoyens
                </p>
                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  {users.length}
                </p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-teal-200 dark:border-teal-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  💚 Impact Écologique
                </p>
                <p className="text-3xl font-black text-teal-600 dark:text-teal-400">
                  {teams.reduce((sum, t) => sum + t.totalScore, 0)}
                </p>
              </div>
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">🌿</span>
              </div>
            </div>
          </div>
        </div>

        {/* Podium Animé - Top 3 Équipes */}
        <div className="mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-yellow-400 dark:border-yellow-600">
          <div className="px-8 py-6 bg-linear-to-r from-yellow-500 via-amber-500 to-orange-500">
            <h2 className="text-3xl font-black text-white flex items-center justify-center gap-3">
              <span className="text-4xl animate-bounce">🏆</span>
              Podium des Champions - Top 3 Équipes
              <span
                className="text-4xl animate-bounce"
                style={{ animationDelay: "0.2s" }}
              >
                🏆
              </span>
            </h2>
            <p className="text-center text-amber-100 mt-2 font-semibold">
              🌱 Les équipes les plus performantes en développement durable 🌿
            </p>
          </div>

          <div className="p-8">
            {teams.length >= 3 ? (
              <div className="flex flex-col md:flex-row items-end justify-center gap-8">
                {/* Position 2 - Argent (à gauche) */}
                {teams.sort((a, b) => b.totalScore - a.totalScore)[1] && (
                  <div
                    className="relative order-2 md:order-1 w-full md:w-64 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <div className="bg-linear-to-br from-gray-200 via-gray-300 to-gray-400 rounded-3xl p-6 shadow-2xl border-4 border-gray-400 hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-16 h-16 bg-linear-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white animate-pulse">
                          🥈
                        </div>
                      </div>
                      <div className="text-center pt-8">
                        <div className="text-6xl mb-4 font-black text-gray-700">
                          #2
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 min-h-12 flex items-center justify-center">
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[1]
                              .name
                          }
                        </h3>
                        <p className="text-sm text-gray-700 mb-3">
                          👥{" "}
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[1]
                              .members.length
                          }{" "}
                          membres
                        </p>
                        <div className="bg-white/80 rounded-2xl p-4 shadow-lg">
                          <div className="text-5xl font-black text-gray-600">
                            {
                              teams.sort(
                                (a, b) => b.totalScore - a.totalScore
                              )[1].totalScore
                            }
                          </div>
                          <p className="text-sm text-gray-600 font-bold mt-1">
                            points
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Position 1 - Or (au centre, plus grand) */}
                {teams.sort((a, b) => b.totalScore - a.totalScore)[0] && (
                  <div
                    className="relative order-1 md:order-2 w-full md:w-72 animate-fade-in scale-110"
                    style={{ transform: "scale(1.1) translateY(-30px)" }}
                  >
                    <div className="bg-linear-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-3xl p-8 shadow-2xl border-4 border-yellow-500 hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-20 h-20 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-5xl shadow-2xl border-4 border-white animate-bounce">
                          🥇
                        </div>
                      </div>
                      <div className="absolute -top-12 -right-4 text-6xl animate-spin-slow">
                        ⭐
                      </div>
                      <div
                        className="absolute -top-12 -left-4 text-6xl animate-spin-slow"
                        style={{ animationDelay: "1s" }}
                      >
                        ✨
                      </div>
                      <div className="text-center pt-12">
                        <div className="text-7xl mb-4 font-black text-yellow-900 animate-pulse">
                          #1
                        </div>
                        <h3 className="text-3xl font-black text-yellow-900 mb-3 min-h-14 flex items-center justify-center">
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[0]
                              .name
                          }
                        </h3>
                        <p className="text-sm text-yellow-900 mb-4 font-bold">
                          👥{" "}
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[0]
                              .members.length
                          }{" "}
                          membres
                        </p>
                        <div className="bg-white/90 rounded-2xl p-6 shadow-xl">
                          <div className="text-6xl font-black bg-clip-text text-transparent bg-linear-to-r from-yellow-600 to-amber-600">
                            {
                              teams.sort(
                                (a, b) => b.totalScore - a.totalScore
                              )[0].totalScore
                            }
                          </div>
                          <p className="text-sm text-yellow-800 font-black mt-2">
                            points
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Position 3 - Bronze (à droite) */}
                {teams.sort((a, b) => b.totalScore - a.totalScore)[2] && (
                  <div
                    className="relative order-3 md:order-3 w-full md:w-64 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                  >
                    <div className="bg-linear-to-br from-orange-300 via-orange-400 to-orange-500 rounded-3xl p-6 shadow-2xl border-4 border-orange-500 hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div
                          className="w-16 h-16 bg-linear-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-2xl border-4 border-white animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        >
                          🥉
                        </div>
                      </div>
                      <div className="text-center pt-8">
                        <div className="text-6xl mb-4 font-black text-orange-900">
                          #3
                        </div>
                        <h3 className="text-2xl font-black text-orange-900 mb-2 min-h-12 flex items-center justify-center">
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[2]
                              .name
                          }
                        </h3>
                        <p className="text-sm text-orange-900 mb-3">
                          👥{" "}
                          {
                            teams.sort((a, b) => b.totalScore - a.totalScore)[2]
                              .members.length
                          }{" "}
                          membres
                        </p>
                        <div className="bg-white/80 rounded-2xl p-4 shadow-lg">
                          <div className="text-5xl font-black text-orange-600">
                            {
                              teams.sort(
                                (a, b) => b.totalScore - a.totalScore
                              )[2].totalScore
                            }
                          </div>
                          <p className="text-sm text-orange-700 font-bold mt-1">
                            points
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  🌱 Pas encore assez d&apos;équipes pour afficher le podium
                  (minimum 3 équipes requises)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-xl border border-green-200 dark:border-green-700 inline-flex">
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "teams"
                ? "bg-green-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-green-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">🌳</span>
              Équipes ({teams.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "users"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">♻️</span>
              Éco-Citoyens ({users.length})
            </span>
          </button>
        </div>

        {/* Teams Section */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            {/* Bouton Créer une Équipe */}
            <div className="flex justify-end">
              <button
                onClick={() => setCreateTeamModal(true)}
                className="group px-6 py-4 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center gap-3"
              >
                <svg
                  className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-lg">Créer une Équipe</span>
                <span className="text-2xl">🌱</span>
              </button>
            </div>

            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-green-200 dark:border-green-700">
              <div className="px-8 py-6 border-b border-green-200 dark:border-green-700 bg-linear-to-r from-green-600 to-emerald-600">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                  <span className="text-3xl">🌍</span>
                  Gestion des Équipes Durables
                </h2>
                <p className="text-sm text-green-100 mt-1">
                  Modifiez les scores d&apos;impact écologique en temps réel -
                  Les classements se mettent à jour automatiquement
                </p>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams
                  .sort((a, b) => b.totalScore - a.totalScore)
                  .map((team, index) => (
                    <div
                      key={team._id}
                      className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:-translate-y-1"
                    >
                      {/* Ranking Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg shadow-lg ${
                            index === 0
                              ? "bg-linear-to-br from-yellow-400 to-yellow-600 text-white"
                              : index === 1
                              ? "bg-linear-to-br from-gray-300 to-gray-500 text-white"
                              : index === 2
                              ? "bg-linear-to-br from-orange-400 to-orange-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          #{index + 1}
                        </div>
                      </div>

                      <div className="p-6 pt-20">
                        {/* Team Name */}
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-10">
                          {team.description || "Pas de description"}
                        </p>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              team.category === "Tech"
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                : team.category === "Design"
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                                : team.category === "Marketing"
                                ? "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200"
                                : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                            }`}
                          >
                            {team.category}
                          </span>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold">
                            👥 {team.members.length}/{team.maxMembers}
                          </span>
                        </div>

                        {/* Creator */}
                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-semibold">Créateur:</span>{" "}
                          {team.creator ? team.creator.name : "Non défini"}
                        </div>

                        {/* Score Section - Editable with +/- buttons */}
                        <div className="mb-4 bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border-2 border-indigo-200 dark:border-indigo-800">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              Score Total
                            </span>
                            {editingScoreTeamId === team._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setTempScore(Math.max(0, tempScore - 10))
                                  }
                                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all font-bold text-lg"
                                  title="−10 points"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  value={tempScore}
                                  onChange={(e) =>
                                    setTempScore(parseInt(e.target.value) || 0)
                                  }
                                  className="w-24 px-3 py-1 text-center font-black text-xl bg-white dark:bg-gray-700 border-2 border-indigo-500 rounded-lg text-indigo-600 dark:text-indigo-400"
                                  autoFocus
                                />
                                <button
                                  onClick={() => setTempScore(tempScore + 10)}
                                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all font-bold text-lg"
                                  title="+10 points"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => {
                                    handleQuickScoreUpdate(team._id, tempScore);
                                  }}
                                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                  title="Sauvegarder"
                                >
                                  ✓
                                </button>
                                <button
                                  onClick={() => setEditingScoreTeamId(null)}
                                  className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-all"
                                  title="Annuler"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingScoreTeamId(team._id);
                                  setTempScore(team.totalScore);
                                }}
                                className="flex items-center gap-2 group/score hover:scale-105 transition-transform"
                              >
                                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                                  {team.totalScore}
                                </span>
                                <svg
                                  className="w-5 h-5 text-gray-400 group-hover/score:text-indigo-600 dark:group-hover/score:text-indigo-400 transition-colors"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setViewTeamModal(team)}
                            className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Détails
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTeam(team._id, team.name)
                            }
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Section */}
        {activeTab === "users" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-green-600 to-emerald-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Équipe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Inscrit le
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 dark:text-gray-300">
                          {user.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {user.team ? (
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold">
                            {user.team.name}
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                            Aucune équipe
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {/* Boutons +/- pour modifier le score rapidement */}
                          <button
                            onClick={() =>
                              handleQuickUserScoreUpdate(
                                user._id,
                                user.score,
                                -10
                              )
                            }
                            className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg font-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                            title="Retirer 10 points"
                          >
                            -
                          </button>

                          {editingUserScoreId === user._id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={tempUserScore}
                                onChange={(e) =>
                                  setTempUserScore(Number(e.target.value))
                                }
                                className="w-20 px-2 py-1 border-2 border-green-500 rounded-lg text-center font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
                                min="0"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUserScoreEdit(user._id)}
                                className="p-1 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                                title="Valider"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => setEditingUserScoreId(null)}
                                className="p-1 bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-all"
                                title="Annuler"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingUserScoreId(user._id);
                                setTempUserScore(user.score);
                              }}
                              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full font-black hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all cursor-pointer"
                            >
                              {user.score} pts
                            </button>
                          )}

                          <button
                            onClick={() =>
                              handleQuickUserScoreUpdate(
                                user._id,
                                user.score,
                                10
                              )
                            }
                            className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg font-black flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                            title="Ajouter 10 points"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            setAssignUserModal({
                              userId: user._id,
                              userName: user.name,
                            })
                          }
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg transform hover:scale-105 flex items-center gap-2"
                        >
                          <svg
                            className="w-4 h-4"
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
                          Assigner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Assign User to Team Modal */}
      {assignUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-indigo-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Assigner à une Équipe
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {assignUserModal.userName}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Sélectionner l&apos;équipe
              </label>
              <select
                value={selectedTeamForAssign}
                onChange={(e) => setSelectedTeamForAssign(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-semibold focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <option value="">-- Choisir une équipe --</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name} ({team.members.length}/{team.maxMembers})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setAssignUserModal(null);
                  setSelectedTeamForAssign("");
                }}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-bold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignUserToTeam}
                disabled={!selectedTeamForAssign}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Assigner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Edit Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-indigo-500/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                Modifier le Score
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedTeam.name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                Nouveau Score
              </label>
              <input
                type="number"
                value={scoreInput}
                onChange={(e) => setScoreInput(Number(e.target.value))}
                className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center text-3xl font-black focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                min="0"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedTeam(null);
                  setScoreInput(0);
                }}
                className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleUpdateScore(selectedTeam._id, scoreInput)}
                className="flex-1 px-6 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {viewTeamModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full p-8 border-2 border-cyan-500/20 my-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-3xl">👥</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                    {viewTeamModal.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {viewTeamModal.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewTeamModal(null)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Description */}
            {viewTeamModal.description && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
                <p className="text-gray-700 dark:text-gray-300">
                  {viewTeamModal.description}
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {viewTeamModal.totalScore}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Score Total
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                  {viewTeamModal.members.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Membres
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/30 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
                  {viewTeamModal.invites?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Invités
                </p>
              </div>
            </div>

            {/* Membres */}
            <div className="mb-6">
              <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>👥</span> Membres Actuels
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {viewTeamModal.members.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          @{member.username}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-bold">
                      {member.score} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invités */}
            {viewTeamModal.invites && viewTeamModal.invites.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>✉️</span> Invités
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {viewTeamModal.invites.map((invite, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {invite.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">
                            {invite.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {invite.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(invite.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Créateur */}
            {viewTeamModal.creator && (
              <div className="p-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Créé par
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {viewTeamModal.creator.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  le {new Date(viewTeamModal.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setViewTeamModal(null)}
                className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() =>
                  handleDeleteTeam(viewTeamModal._id, viewTeamModal.name)
                }
                className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-colors"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {createTeamModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 border-2 border-green-500/30 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-3xl font-black bg-clip-text text-transparent bg-linear-to-r from-green-700 via-emerald-600 to-teal-700 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400">
                Créer une Nouvelle Équipe
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Ajoutez une équipe de développement durable
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Nom de l'équipe */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="text-xl">🏷️</span>
                  Nom de l&apos;Équipe *
                </label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all font-medium"
                  placeholder="Ex: Les Éco-Warriors"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="text-xl">📝</span>
                  Description
                </label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all font-medium resize-none"
                  placeholder="Décrivez la mission de votre équipe..."
                  rows={4}
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="text-xl">🎯</span>
                  Catégorie *
                </label>
                <select
                  value={newTeam.category}
                  onChange={(e) =>
                    setNewTeam({ ...newTeam, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all font-bold cursor-pointer"
                >
                  <option value="Tech">💻 Tech</option>
                  <option value="Design">🎨 Design</option>
                  <option value="Marketing">📢 Marketing</option>
                  <option value="Business">💼 Business</option>
                </select>
              </div>

              {/* Nombre maximum de membres */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  <span className="text-xl">👥</span>
                  Nombre Maximum de Membres
                </label>
                <input
                  type="number"
                  value={newTeam.maxMembers}
                  onChange={(e) =>
                    setNewTeam({
                      ...newTeam,
                      maxMembers: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border-2 border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 transition-all font-bold text-center"
                  min="2"
                  max="50"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <span>ℹ️</span>
                  Entre 2 et 50 membres
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => {
                  setCreateTeamModal(false);
                  setNewTeam({
                    name: "",
                    description: "",
                    category: "Tech",
                    maxMembers: 10,
                  });
                }}
                className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateTeam}
                className="flex-1 px-6 py-4 bg-linear-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-2xl">✨</span>
                Créer l&apos;Équipe
                <span className="text-2xl">🌱</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
