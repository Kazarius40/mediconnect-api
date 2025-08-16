'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface EntityHeaderProps {
  title: string;
  editPath: string;
  backText: string;
  onBack?: () => void;
  onDeleteClick?: () => void;
  showControls?: boolean;
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
  title,
  editPath,
  backText,
  onBack,
  onDeleteClick,
  showControls = false,
}) => {
  const router = useRouter();
  return (
    <>
      <button
        onClick={onBack || (() => router.back())}
        className="
          mb-6
          inline-flex items-center gap-2
          text-blue-600 font-medium
          px-3 py-1.5
          rounded-md
          border border-transparent
          hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700
          cursor-pointer
          transition-colors
        "
      >
        <span className="text-lg">←</span>
        <span>{backText}</span>
      </button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>

        {showControls && (
          <div className="flex gap-2">
            <button
              onClick={() => router.push(editPath)}
              className=" px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transform transition-transform duration-200 hover:scale-105"
            >
              Edit
            </button>

            <button
              onClick={onDeleteClick ?? (() => {})}
              className=" px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transform transition-transform duration-200 hover:scale-105"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};
