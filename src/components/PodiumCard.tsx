"use client";

import type { PodiumEntry } from "@/types/podium";

interface PodiumCardProps {
  entry: PodiumEntry;
  rank: number;
}

// Composant optimisé et accessible pour afficher une carte de classement
export default function PodiumCard({ entry, rank }: PodiumCardProps) {
  // Fonction pour obtenir les styles selon le rang (top 3)
  const getCardStyles = () => {
    switch (rank) {
      case 1:
        return "bg-linear-to-br from-yellow-400 to-yellow-600 border-yellow-500";
      case 2:
        return "bg-linear-to-br from-gray-300 to-gray-500 border-gray-400";
      case 3:
        return "bg-linear-to-br from-orange-400 to-orange-600 border-orange-500";
      default:
        return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  // Fonction pour obtenir l'emoji de médaille
  const getMedalEmoji = () => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  const isTopThree = rank <= 3;
  const textColor = isTopThree
    ? "text-gray-900"
    : "text-gray-900 dark:text-gray-100";

  return (
    <article
      className={`
        relative rounded-lg border-2 p-4 shadow-md transition-all duration-300
        hover:shadow-xl hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500
        ${getCardStyles()}
      `}
      aria-label={`Équipe ${entry.name}, classée ${rank}${
        rank === 1 ? "ère" : "ème"
      } avec ${entry.score} points`}
    >
      {/* Badge de position */}
      <div
        className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg"
        aria-hidden="true"
      >
        {rank}
      </div>

      {/* Médaille pour le top 3 */}
      {getMedalEmoji() && (
        <div
          className="absolute -top-2 -right-2 text-4xl"
          aria-label={`Médaille ${
            rank === 1 ? "d'or" : rank === 2 ? "d'argent" : "de bronze"
          }`}
        >
          {getMedalEmoji()}
        </div>
      )}

      {/* Contenu principal */}
      <div className="ml-6 space-y-2">
        <h2 className={`text-xl font-bold ${textColor} truncate`}>
          {entry.name}
        </h2>

        {entry.team && (
          <p
            className={`text-sm ${
              isTopThree ? "text-gray-800" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <span className="sr-only">Équipe:</span>
            <strong>Équipe:</strong> {entry.team}
          </p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className={`text-2xl font-extrabold ${textColor}`}>
            <span className="sr-only">Score:</span>
            {entry.score} <span className="text-base font-normal">pts</span>
          </div>

          <span
            className={`
              px-3 py-1 text-xs font-semibold rounded-full
              ${
                isTopThree
                  ? "bg-white/80 text-gray-900"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
              }
            `}
            aria-label={`Catégorie ${entry.category}`}
          >
            {entry.category === "team"
              ? "👥 Équipe"
              : entry.category === "individual"
              ? "👤 Individuel"
              : "🤝 Mixte"}
          </span>
        </div>
      </div>
    </article>
  );
}
