'use client';

import { trpc } from '@/app/utils/trpc';
import { useIntersectionObserver } from '@/app/hooks/useIntersectionObserver';
import { useUpdates } from '@/app/components/UpdatesList/useUpdates';

import styles from './UpdatesList.module.css';

export const UpdatesList = trpc.withTRPC(() => {
  const { isLoading, isFetching, data, error, hasNextPage, fetchNextPage } = useUpdates();
  const observerTargetRef = useIntersectionObserver(() => {
    if (!isFetching) {
      fetchNextPage();
    }
  }, [data, isFetching]);

  const renderContent = () => {
    if (isLoading && !data) {
      return 'loading...';
    }

    if (error) {
      return `Error: ${error.message}`;
    }

    return (
      <>
        {data.pages.map(({ items }, index) => (
          <div key={index} className={styles.page}>
            {items.map((item) => (
              <div key={item.key} className={styles.update}>
                {item.title}
              </div>
            ))}
          </div>
        ))}
        {hasNextPage && <div className={styles.observer} ref={observerTargetRef} />}
        {hasNextPage && <div className={styles.nextLoading}>Loading...</div>}
      </>
    );
  };

  return <div className={styles.root}>{renderContent()}</div>;
});
