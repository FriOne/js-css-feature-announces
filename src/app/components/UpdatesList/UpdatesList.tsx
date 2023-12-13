'use client';

import { trpc } from '@/app/utils/trpc';
import { useIntersectionObserver } from '@/app/hooks/useIntersectionObserver';
import { useUpdates } from '@/app/components/UpdatesList/useUpdates';
import { getFeatureLinkByKey } from '@/app/utils/getFeatureLinkByKey';

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
          <ul key={index} className={styles.page}>
            {items.map((item) => (
              <li key={item.key} className={styles.update}>
                <a className={styles.title} href={getFeatureLinkByKey(item.key)}>
                  {item.title}
                </a>
                <div className={styles.description}>{item.description}</div>
              </li>
            ))}
          </ul>
        ))}
        {hasNextPage && <div className={styles.observer} ref={observerTargetRef} />}
        {hasNextPage && <div className={styles.nextLoading}>Loading...</div>}
      </>
    );
  };

  return <div className={styles.root}>{renderContent()}</div>;
});
