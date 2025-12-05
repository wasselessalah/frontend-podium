"use client";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

// Composant d'erreur accessible
export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="max-w-2xl mx-auto my-8 p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-lg"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl" aria-hidden="true">
          ⚠️
        </span>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-300 mb-2">
            Erreur
          </h2>
          <p className="text-red-800 dark:text-red-400 mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Réessayer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
