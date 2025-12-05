"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface Invite {
  name: string;
  email: string;
}

export default function CreateTeamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Tech",
    maxMembers: 10,
  });
  const [invites, setInvites] = useState<Invite[]>([]);
  const [currentInvite, setCurrentInvite] = useState({ name: "", email: "" });

  const handleAddInvite = () => {
    if (currentInvite.name && currentInvite.email) {
      setInvites([...invites, currentInvite]);
      setCurrentInvite({ name: "", email: "" });
    }
  };

  const handleRemoveInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          invites,
        }),
      });

      if (response.ok) {
        router.push("/teams");
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-indigo-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            Créer une Équipe
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Constituez votre équipe et invitez vos collaborateurs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Info Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📋</span>
              Informations de l&apos;Équipe
            </h2>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Nom de l&apos;Équipe *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg font-semibold"
                  placeholder="Ex: Les Innovateurs"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                  rows={4}
                  placeholder="Décrivez votre équipe et ses objectifs..."
                />
              </div>

              {/* Category & Max Members */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-semibold"
                  >
                    <option value="Tech">💻 Tech</option>
                    <option value="Design">🎨 Design</option>
                    <option value="Marketing">📢 Marketing</option>
                    <option value="Business">💼 Business</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Membres Max
                  </label>
                  <input
                    type="number"
                    value={formData.maxMembers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxMembers: Number(e.target.value),
                      })
                    }
                    className="w-full px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-center text-xl font-black"
                    min="2"
                    max="50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Invites Card */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">👥</span>
              Inviter des Membres
            </h2>

            {/* Add Invite Form */}
            <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  value={currentInvite.name}
                  onChange={(e) =>
                    setCurrentInvite({ ...currentInvite, name: e.target.value })
                  }
                  className="px-4 py-3 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom complet"
                />
                <input
                  type="email"
                  value={currentInvite.email}
                  onChange={(e) =>
                    setCurrentInvite({
                      ...currentInvite,
                      email: e.target.value,
                    })
                  }
                  className="px-4 py-3 border-2 border-indigo-300 dark:border-indigo-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <button
                type="button"
                onClick={handleAddInvite}
                className="w-full px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all transform hover:scale-105"
              >
                ➕ Ajouter à la liste
              </button>
            </div>

            {/* Invites List */}
            {invites.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3">
                  {invites.length} membre(s) invité(s)
                </p>
                {invites.map((invite, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {invite.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {invite.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {invite.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveInvite(index)}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-lg">Aucun membre invité pour le moment</p>
                <p className="text-sm mt-2">
                  Ajoutez des membres pour constituer votre équipe
                </p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-8 py-5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Création..." : "🚀 Créer l'Équipe"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
