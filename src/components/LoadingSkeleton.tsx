"use client";

interface LoadingSkeletonProps {
  count?: number;
}

// Composant de chargement accessible (skeleton)
export default function LoadingSkeleton({ count = 5 }: LoadingSkeletonProps) {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-live="polite"
      aria-label="Chargement en cours"
    >
      <span className="sr-only">Chargement des données du classement...</span>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative rounded-lg border-2 border-gray-200 dark:border-gray-700 p-4 shadow-md animate-pulse"
          aria-hidden="true"
        >
          <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="ml-6 space-y-3">
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
