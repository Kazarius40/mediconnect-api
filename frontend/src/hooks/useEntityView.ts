import { useEffect, useState } from 'react';

export function useEntityView<T>(
  fetchFn: (id: number) => Promise<T>,
  id?: string | string[],
) {
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await fetchFn(Number(id));
        setEntity(data);
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  return { entity, loading, error, setEntity };
}
