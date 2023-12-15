'use client';
import { useMemo } from 'react';

import { trpc } from '@/app/utils/trpc';
import { useIntersectionObserver } from '@/app/hooks/useIntersectionObserver';
import { useUpdates } from '@/app/components/UpdatesList/useUpdates';
import { getFeatureLinkByKey } from '@/app/utils/getFeatureLinkByKey';
import { FeatureUpdateSchemaType } from '@/server/schemas/featureUpdateSchema';

import styles from './UpdatesList.module.css';

type FeatureUpdateWithStringDates = Omit<FeatureUpdateSchemaType, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};
type UpdatesByDate = Record<string, FeatureUpdateWithStringDates[]>;

export const UpdatesList = trpc.withTRPC(() => {
  const { isLoading, isFetching, data, error, hasNextPage, fetchNextPage } = useUpdates();
  const updatesByDate = useMemo(() => {
    if (!data) {
      return;
    }

    return data.pages.reduce((acc, nextPage) => {
      for (const item of nextPage.items) {
        const date = item.updatedAt.slice(0, 10);
        acc[date] = acc[date] || [];
        acc[date].push(item);
      }

      return acc;
    }, {} as UpdatesByDate);
  }, [data]);

  const observerTargetRef = useIntersectionObserver(() => {
    if (!isFetching) {
      fetchNextPage();
    }
  }, [data, isFetching]);

  const renderContent = () => {
    if (isLoading || !data) {
      return <div className={styles.loading}>loading</div>;
    }

    if (error) {
      return <div className={styles.error}>{`Error: ${error.message}`}</div>;
    }

    return (
      <>
        {Object.entries(updatesByDate).map(([date, items], index) => (
          <section key={date} className={styles.itemsByDate}>
            <h2 className={styles.date}>{date}</h2>
            <ul key={index} className={styles.itemsList}>
              {items.map((item) => (
                <li key={item.key} className={styles.update}>
                  <a className={styles.title} href={getFeatureLinkByKey(item.key)} target="_blank">
                    {item.title}
                  </a>
                  <div className={styles.description}>{item.description}</div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {hasNextPage && <div className={styles.observer} ref={observerTargetRef} />}
        {hasNextPage && <div className={styles.nextLoading}>Loading...</div>}
      </>
    );
  };

  return <div className={styles.root}>{renderContent()}</div>;
});
