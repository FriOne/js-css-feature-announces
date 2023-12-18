import { UpdatesList } from '@/app/components/UpdatesList/UpdatesList';

import styles from './page.module.css';

export default async function Home() {
  return (
    <>
      <a
        className={styles.githubLink}
        target="_blank"
        aria-label="Go to the GitHub repository"
        href="https://github.com/FriOne/js-css-feature-announces"
      >
        <span></span>
      </a>

      <main className={styles.main}>
        <h1 className={styles.title}>I Can Use</h1>
        <div className={styles.description}>
          The project notifies about JS/CSS features that cross 3 percent global usage. You can
          subscribe to the{' '}
          <a target="_blank" href="https://t.me/js_css_updates_3">
            telegram chat
          </a>{' '}
          to receive these updates.
        </div>
        <UpdatesList />
      </main>
    </>
  );
}
