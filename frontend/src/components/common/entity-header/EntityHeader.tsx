'use client';

import { useRouter } from 'next/navigation';
import styles from './style.module.css';

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
    <div className={styles.wrapper}>
      <button onClick={() => router.back()} className={styles.backBtn}>
        <span>←</span> <span>{backText}</span>
      </button>
      <div className={styles.header}>
        <h1>{title}</h1>
        {showControls && (
          <div className={styles.headerActions}>
            <button
              onClick={() => router.push(editPath)}
              className={styles.editBtn}
            >
              Edit
            </button>
            <button
              onClick={onDeleteClick ?? (() => {})}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
