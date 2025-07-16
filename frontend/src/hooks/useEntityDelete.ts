'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useEntityDelete(
  deleteFn: (id: number) => Promise<void>,
  redirectPath: string,
) {
  const router = useRouter();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      await deleteFn(id);
      router.push(redirectPath);
    } catch (err) {
      console.error('Failed to delete', err);
      setDeleting(false);
    }
  };

  return { isConfirmOpen, setIsConfirmOpen, deleting, handleDelete };
}
