import { ActorsService } from '@/api';
import WikiCard, { WikiLoaderCard } from '@/components/ActorCardSmall';
import { useActions } from '@/store/useActions';
import { WikiActorInfo } from '@/types';
import { FC, useEffect, useState } from 'react';
import styles from './wikiResults.module.scss';

interface WikiResultsProps {
  names: Array<string>;
  preloadersNumber?: number;
  recognitionFailed: boolean;
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
  names,
  preloadersNumber = 5,
  recognitionFailed
}) => {
  const { setMessage } = useActions();
  const [loading, setLoading] = useState(true);
  const [wikiActors, setWikiActors] = useState(testActors);

  const fetchWikiActors = async (names: string[]) => {
    try {
      setLoading(true);
      const data = await ActorsService.parseWikiActors(names);
      setLoading(false);
      setWikiActors(data);
    } catch (e) {
      setLoading(false);
      setMessage({ msg: 'Couldn`t find actor info', type: 'error' });
    }
  };

  useEffect(() => {
    if (names.length && !recognitionFailed) {
      fetchWikiActors(names);
    }
  }, [names, recognitionFailed]);

  return (
    <div className={styles.WikiResultsWrapper}>
      <h2>Wikipedia results:</h2>
      {recognitionFailed ? (
        <div className={styles.NotFoundWrapper}>
          <p>Could not find wiki links</p>
        </div>
      ) : loading ? (
        <div className={styles.WikiResultsInner}>
          {[...Array(preloadersNumber)].map(() => (
            <WikiLoaderCard />
          ))}
        </div>
      ) : wikiActors.length > 0 ? (
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
