import { useEntityFetch } from '@/hooks/core/useEntityFetch.hook';

export function useEntityViewHook<T>(
  fetchFn: (id: number) => Promise<T>,
  id?: string | string[],
) {
  const numericId =
    typeof id === 'string'
      ? Number(id)
      : Array.isArray(id)
        ? Number(id[0])
        : undefined;
  const { mainEntity, loading, error, setMainEntity } = useEntityFetch<T>(
    numericId ? () => fetchFn(numericId) : undefined,
    undefined,
    [numericId],
  );

  return { entity: mainEntity, loading, error, setEntity: setMainEntity };
}
