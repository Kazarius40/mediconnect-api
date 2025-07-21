'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { stringifyBackendErrors } from '@/utils/errors/parse-backend-errors.util';
import toast from 'react-hot-toast';

export function useEntityDeleteHook(
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
      toast.success('Deleted successfully!');
      router.push(redirectPath);
    } catch (err) {
      const message = stringifyBackendErrors(err);
      console.error('Failed to delete:', message);
      toast.error(message);
      setDeleting(false);
    }
  };

  return {
    isConfirmOpen,
    setIsConfirmOpen,
    deleting,
    handleDelete,
  };
}
