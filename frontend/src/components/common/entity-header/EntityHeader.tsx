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
    <div className="wrapper">
      <button onClick={() => router.back()} className="back-btn">
        <span>←</span> <span>{backText}</span>
      </button>
      <div className="header">
        <h1>{title}</h1>
        {showControls && (
          <div className="header__actions">
            <button onClick={() => router.push(editPath)} className="edit-btn">
              Edit
            </button>
            <button
              onClick={onDeleteClick ?? (() => {})}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
