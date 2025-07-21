import { useEffect, useState, DependencyList } from 'react';

/**
 * useEntityFetch
 *
 * A generic React hook for fetching:
 *  - one main entity (optional)
 *  - multiple extra related entities (optional)
 *
 * Універсальний React-хук для отримання:
 *  - однієї основної сутності (необов’язково)
 *  - кількох додаткових пов’язаних сутностей (необов’язково)
 *
 * @template T - type of the main entity
 * @template E - type of the extra data object (keys = related entities)
 *
 * @template T - тип основної сутності
 * @template E - тип об’єкта з додатковими даними (ключі = пов’язані сутності)
 */
export function useEntityFetch<T, E extends Record<string, unknown> = {}>(
  /**
   * Main fetch function for the primary entity
   * (e.g. clinicApi.getById)
   *
   * Основна функція отримання даних для головної сутності
   * (наприклад, clinicApi.getById)
   */
  mainFetch?: () => Promise<T>,

  /**
   * Array of extra fetch configurations for related data
   * Each config has a key and a fetch function
   *
   * Масив конфігурацій додаткових запитів для пов’язаних даних
   * Кожна конфігурація має ключ і функцію отримання даних
   */
  extraFetches?: {
    [K in keyof E]: {
      key: K;
      fetchFn: () => Promise<E[K]>;
    };
  }[keyof E][],

  /**
   * Dependencies for triggering the effect
   * (e.g. [id])
   *
   * Залежності, при зміні яких буде виконуватись ефект
   * (наприклад, [id])
   */
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

        // Fetch extra data in parallel if provided
        // Отримуємо додаткові дані паралельно, якщо вони передані
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

        // Fetch main entity if provided
        // Отримуємо головну сутність, якщо передана функція mainFetch
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
