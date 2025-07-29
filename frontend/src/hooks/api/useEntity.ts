import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export function useEntity<T>(key: string, initialData: T) {
  const swr = useSWR<T>(key, fetcher, {
    fallbackData: initialData,
    revalidateOnMount: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    ...swr,
    data: swr.data as T,
  };
}
