"use client";

import type { PodiumEntry } from "@/types/podium";

interface PodiumTop3Props {
  entries: PodiumEntry[];
}

// Composant podium visuel pour le top 3 (style olympique)
export default function PodiumTop3({ entries }: PodiumTop3Props) {
  if (!entries || entries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" role="status">
        Aucun classement disponible
      </div>
    );
  }

  // Organiser les positions pour l'affichage visuel (2ème à gauche, 1er au centre, 3ème à droite)
  const first = entries.find((e) => e.position === 1);
  const second = entries.find((e) => e.position === 2);
  const third = entries.find((e) => e.position === 3);

  const renderPodiumPosition = (
    entry: PodiumEntry | undefined,
    position: number,
    heightClass: string,
    bgColor: string,
    medal: string
  ) => {
    if (!entry) return null;

    return (
      <div
        className="flex flex-col items-center justify-end flex-1 min-w-0"
        aria-label={`${position}${position === 1 ? "ère" : "ème"} place: ${
          entry.name
        } avec ${entry.score} points`}
      >
        {/* Médaille */}
        <div className="text-6xl mb-2 animate-bounce" aria-hidden="true">
          {medal}
        </div>

        {/* Info équipe */}
        <div className="text-center mb-3 px-2 w-full">
          <h3 className="font-bold text-lg truncate" title={entry.name}>
            {entry.name}
          </h3>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {entry.score} pts
          </p>
          {entry.team && (
            <p
              className="text-sm text-gray-600 dark:text-gray-400 truncate"
              title={entry.team}
            >
              {entry.team}
            </p>
          )}
        </div>

        {/* Marche du podium */}
        <div
          className={`
            w-full ${heightClass} ${bgColor} 
            rounded-t-xl flex items-center justify-center
            font-bold text-white text-4xl shadow-lg
            transition-all duration-300 hover:scale-105
          `}
          aria-hidden="true"
        >
          {position}
        </div>
      </div>
    );
  };

  return (
    <section className="mb-12" aria-labelledby="podium-title">
      <h2
        id="podium-title"
        className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white"
      >
        🏆 Podium des Champions
      </h2>

      {/* Podium visuel */}
      <div
        className="flex items-end justify-center gap-4 max-w-4xl mx-auto"
        role="list"
        aria-label="Classement du top 3"
      >
        {/* 2ème place */}
        {renderPodiumPosition(
          second,
          2,
          "h-48",
          "bg-linear-to-b from-gray-300 to-gray-500",
          "🥈"
        )}

        {/* 1ère place */}
        {renderPodiumPosition(
          first,
          1,
          "h-64",
          "bg-linear-to-b from-yellow-400 to-yellow-600",
          "🥇"
        )}

        {/* 3ème place */}
        {renderPodiumPosition(
          third,
          3,
          "h-40",
          "bg-linear-to-b from-orange-400 to-orange-600",
          "🥉"
        )}
      </div>
    </section>
  );
}
