import { FC, useState } from 'react';
import styles from './wikiResults.module.scss';

interface WikiResultsprops {
  names: Array<string> | null;
  preloadersNumber?: number;
}

const WikiResults: FC<WikiResultsprops> = ({
  names = null,
  preloadersNumber = 9
}) => {
  const [loading, setLoading] = useState(true);

  if (names) {
    return <></>;
  }
  return (
    <div className={styles.WikiResultsWrapper}>
      <h2>Wikipedia results:</h2>
      <div className={styles.WikiResultsInner}>
        {[...Array(preloadersNumber)].map(() => (
          <WikiLoaderCard />
        ))}
      </div>
    </div>
  );
};

export default WikiResults;

const WikiLoaderCard = () => (
  <div className={styles.WikiPreloaderCard}>
    <div className={styles.body}>
      <div className={styles.imgWrap} />
      <div className={styles.name}></div>
    </div>
  </div>
);
