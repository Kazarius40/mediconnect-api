import { useEffect, useState, DependencyList } from 'react';

export function useEntityFetch<T, E extends Record<string, unknown> = {}>(
  mainFetch?: () => Promise<T>,

  extraFetches?: {
    [K in keyof E]: {
      key: K;
      fetchFn: () => Promise<E[K]>;
    };
  }[keyof E][],

  dependencies: DependencyList = [],
) {
  const [mainEntity, setMainEntity] = useState<T | null>(null);
  const [extraData, setExtraData] = useState<Partial<E>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const results: Partial<E> = {};

        if (extraFetches?.length) {
          const promises = extraFetches.map((cfg) => cfg.fetchFn());
          const responses = await Promise.allSettled(promises);

          responses.forEach((res, idx) => {
            const cfg = extraFetches[idx];
            if (res.status === 'fulfilled') {
              results[cfg.key] = res.value;
            } else {
              console.error(`Failed to fetch ${String(cfg.key)}`, res.reason);
            }
          });
        }

        if (isMounted) {
          setExtraData(results);
        }

        if (mainFetch) {
          const mainRes = await mainFetch();
          if (isMounted) setMainEntity(mainRes);
        }
      } catch (err) {
        if (isMounted) setError('Failed to load data');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return {
    mainEntity,
    extraData: extraData as E,
    loading,
    error,
    setMainEntity,
  };
}
