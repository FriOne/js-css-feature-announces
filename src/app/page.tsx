import { UpdatesList } from '@/app/components/UpdatesList/UpdatesList';

import styles from './page.module.css';

export default async function Home() {
  return (
    <main className={styles.main}>
      <UpdatesList />
    </main>
  );
}
