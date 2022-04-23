import { ActorsService } from '@/api';
import ActorCard, { ActorLoaderCard } from '@/components/ActorCard';
import { useActions } from '@/store/useActions';
import { ActorInfo } from '@/types';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import useLoadersAmount from '@/hooks/useLoadersAmount';
import styles from './foundActors.module.scss';
import { ActorDto } from 'api/dto/actor.dto';

interface FoundActorsProps {
  names: Array<string>;
  recognitionFailed: boolean;
  photo: string;
}

const FoundActors: FC<FoundActorsProps> = ({
  names,
  recognitionFailed,
  photo,
}) => {
  const { setMessage } = useActions();
  const loadersAmount = useLoadersAmount('ActorCard');
  const [loading, setLoading] = useState(true);
  const [foundActors, setFoundActors] = useState<ActorDto[]>([]);
  const fetchActors = async (names: string[]) => {
    try {
      setLoading(true);
      const data = await ActorsService.getActors(names);
      console.log({ actors: data });
      setLoading(false);
      setFoundActors(data);
      console.log({ foundActors });
    } catch (e) {
      console.log(e);
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
          {Array(loadersAmount).fill(<ActorLoaderCard />)}
        </div>
      ) : foundActors.length > 0 ? (
        <div className={styles.FoundActorsWrapper}>
          {foundActors.map((actor) => (
            <Link
              scroll={false}
              key={actor.id}
              href={`/facematch/?actor=${actor.name?.split(' ').join('_')}`}
              as={`/actorinfo/${actor.name?.split(' ').join('_')}`}
            >
              <a>
                <ActorCard {...actor} />
              </a>
            </Link>
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
