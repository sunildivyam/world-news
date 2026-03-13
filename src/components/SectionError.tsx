import { AppError } from "@/types/AppError.class";
import React from "react";

interface SectionErrorProps {
  error?: AppError;
  data?: any;
  onRetry?: () => void;
}

export const SectionError: React.FC<SectionErrorProps> = ({
  error,
  data,
  onRetry,
}) => {
  if (!error) return null;

  return (
    <div className="section-error">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-left text-red-600">
          <h2 className="text-2xl font-bold">Error:</h2>
          <h3 className="text-2xl font-bold">{error.source}</h3>
          <p>{error.status}</p>
          <p className="text-center">{error.message}</p>
          <h3 className="text-2xl font-bold">Additional Info</h3>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
