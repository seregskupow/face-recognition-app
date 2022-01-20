import WikiCard, { WikiLoaderCard } from '@/components/ActorCardSmall';
import { WikiActorInfo } from '@/types';
import { FC, useState } from 'react';
import styles from './wikiResults.module.scss';

interface WikiResultsProps {
  names: Array<string> | null;
  preloadersNumber?: number;
}

const testActors: Array<WikiActorInfo> = [
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/800px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg',
    name: 'Chris Hemsworth',
    link: 'https://en.wikipedia.org/wiki/Chris_Hemsworth'
  },
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg',
    name: 'Dwayne Johnson',
    link: 'https://en.wikipedia.org/wiki/Dwayne_Johnson'
  },
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/5/5f/Mark_Wahlberg_2017.jpg',
    name: 'Mark Wahlberg',
    link: 'https://en.wikipedia.org/wiki/Mark_Wahlberg'
  }
];

const WikiResults: FC<WikiResultsProps> = ({
  names = null,
  preloadersNumber = 5
}) => {
  const [loading, setLoading] = useState(true);
  const [wikiActors, setWikiActors] = useState(testActors);

  return (
    <div className={styles.WikiResultsWrapper}>
      <h2>Wikipedia results:</h2>
      {loading ? (
        <div className={styles.WikiResultsInner}>
          {[...Array(preloadersNumber)].map(() => (
            <WikiLoaderCard />
          ))}
        </div>
      ) : wikiActors.length ? (
        <div className={styles.WikiResultsInner}>
          {wikiActors.map((actor) => (
            <WikiCard {...actor} />
          ))}
        </div>
      ) : (
        <div className={styles.NotFoundWrapper}>
          <p>Could not find wiki links</p>
        </div>
      )}
    </div>
  );
};

export default WikiResults;
