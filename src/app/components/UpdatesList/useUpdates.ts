import { trpc } from '@/app/utils/trpc';

export function useUpdates() {
  return trpc.updates.useInfiniteQuery(
    { limit: 100 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );
}
