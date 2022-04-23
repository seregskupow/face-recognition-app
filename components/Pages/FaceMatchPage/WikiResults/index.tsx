import { ActorsService } from '@/api';
import WikiCard, { WikiLoaderCard } from '@/components/ActorCardSmall';
import useLoadersAmount from '@/hooks/useLoadersAmount';
import { useActions } from '@/store/useActions';
import { WikiActor } from 'api/dto/WikiActor.dto';
import { FC, useEffect, useState } from 'react';
import styles from './wikiResults.module.scss';

interface WikiResultsProps {
  names: Array<string>;
  recognitionFailed: boolean;
}

const WikiResults: FC<WikiResultsProps> = ({ names, recognitionFailed }) => {
  const { setMessage } = useActions();
  const loadersAmount = useLoadersAmount('WikiCard');
  const [loading, setLoading] = useState(true);
  const [wikiActors, setWikiActors] = useState<WikiActor[]>([]);

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
          {[...Array(loadersAmount)].map((index) => (
            <WikiLoaderCard key={index} />
          ))}
        </div>
      ) : wikiActors.length > 0 ? (
        <div className={styles.WikiResultsInner}>
          {wikiActors.map((actor) => (
            <a
              key={actor.name}
              href={actor.link}
              target='_blank noreferrer'
              tabIndex={0}
            >
              <WikiCard {...actor} />
            </a>
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
