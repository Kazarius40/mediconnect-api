'use client';

import { useRouter } from 'next/navigation';

import './style.css';

interface EntityHeaderProps {
  title: string;
  editPath: string;
  backText: string;
  onDeleteClick?: () => void;
  showControls?: boolean;
}

export function EntityHeader({
  title,
  editPath,
  backText,
  onDeleteClick,
  showControls = false,
}: EntityHeaderProps) {
  const router = useRouter();
  return (
    <>
      <button onClick={() => router.back()} className="entity-back-btn">
        <span>←</span> <span>{backText}</span>
      </button>
      <div className="entity-header-main">
        <h1 className="entity-header-title">{title}</h1>
        {showControls && (
          <div className="entity-header-actions">
            <button
              onClick={() => router.push(editPath)}
              className="entity-edit-btn"
            >
              Edit
            </button>
            <button
              onClick={onDeleteClick ?? (() => {})}
              className="entity-delete-btn"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
