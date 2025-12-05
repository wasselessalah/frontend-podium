"use client";

import type { CategoryType } from "@/types/podium";

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

// Composant de filtre accessible par catégorie
export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories: { value: CategoryType; label: string; icon: string }[] = [
    { value: "all", label: "Tous", icon: "🌐" },
    { value: "individual", label: "Individuel", icon: "👤" },
    { value: "team", label: "Équipe", icon: "👥" },
    { value: "mixed", label: "Mixte", icon: "🤝" },
  ];

  return (
    <div
      role="group"
      aria-label="Filtrer par catégorie"
      className="flex flex-wrap gap-3 justify-center mb-8"
    >
      {categories.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => onCategoryChange(value)}
          aria-pressed={selectedCategory === value}
          className={`
            px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              selectedCategory === value
                ? "bg-blue-600 text-white shadow-lg scale-105"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:scale-105"
            }
          `}
        >
          <span aria-hidden="true" className="mr-2">
            {icon}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
