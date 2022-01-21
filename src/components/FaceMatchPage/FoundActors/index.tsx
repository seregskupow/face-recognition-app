import { ActorsService } from '@/api';
import ActorCard, { ActorLoaderCard } from '@/components/ActorCard';
import { useActions } from '@/store/useActions';
import { ActorInfo } from '@/types';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './foundActors.module.scss';

interface FoundActorsProps {
  names: Array<string>;
  recognitionFailed: boolean;
  photo: string;
}

const FoundActors: FC<FoundActorsProps> = ({
  names,
  recognitionFailed,
  photo
}) => {
  const { setMessage } = useActions();
  const [loading, setLoading] = useState(true);
  const [foundActors, setFoundActors] = useState<ActorInfo[]>([]);
  const fetchActors = async (names: string[]) => {
    try {
      setLoading(true);
      const data = await ActorsService.searchInfo(names, photo);
      console.log({ actors: data });
      setLoading(false);
      setFoundActors(data);
      console.log({ foundActors });
    } catch (e) {
      setLoading(false);
      setMessage({ msg: 'Couldn`t find actor info', type: 'error' });
    }
  };
  useEffect(() => {
    if (names.length && !recognitionFailed) {
      fetchActors(names);
    }
  }, [names, recognitionFailed]);

  return (
    <div className={styles.FoundActors}>
      <h2 className={clsx(styles.foundActorsTitle, 'mb-20')}>
        Detected actors info:
      </h2>
      {recognitionFailed ? (
        <div className={styles.NotFoundWrapper}>
          <h2>Could not find actors</h2>
        </div>
      ) : loading ? (
        <div className={styles.FoundActorsWrapper}>
          {Array(6).fill(<ActorLoaderCard />)}
        </div>
      ) : foundActors.length > 0 ? (
        <div className={styles.FoundActorsWrapper}>
          {foundActors.map((actor) => (
            <ActorCard {...actor} />
          ))}
        </div>
      ) : (
        <div className={styles.NotFoundWrapper}>
          <h2>Could not find actorss</h2>
        </div>
      )}
    </div>
  );
};

export default FoundActors;
