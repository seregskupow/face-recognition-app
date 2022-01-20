import ActorCard, { ActorLoaderCard } from '@/components/ActorCard';
import { ActorInfo } from '@/types';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './foundActors.module.scss';

interface FoundActorsProps {
  names: Array<string>;
}
// type ActorInfo = {
//   photo: string;
//   name: string;
//   link: string;
//   birthDay: string;
//   birthPlace: string;
// };

const testActors: Array<ActorInfo> = [
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg/800px-Chris_Hemsworth_by_Gage_Skidmore_2_%28cropped%29.jpg',
    name: 'Chris Hemsworth',
    link: 'https://en.wikipedia.org/wiki/Chris_Hemsworth',
    birthDay: 'Jun5, 1971',
    birthPlace: 'Dorchester, Massachusetts'
  },
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/Dwayne_Johnson_2014_%28cropped%29.jpg',
    name: 'Dwayne Johnson',
    link: 'https://en.wikipedia.org/wiki/Dwayne_Johnson',
    birthDay: 'Jun5, 1971',
    birthPlace: 'Dorchester, Massachusetts'
  },
  {
    photo:
      'https://upload.wikimedia.org/wikipedia/commons/5/5f/Mark_Wahlberg_2017.jpg',
    name: 'Mark Wahlberg',
    link: 'https://en.wikipedia.org/wiki/Mark_Wahlberg',
    birthDay: 'Jun5, 1971',
    birthPlace: 'Dorchester, Massachusetts'
  }
];

const FoundActors: FC<FoundActorsProps> = ({ names }) => {
  const [loading, setLoading] = useState(true);
  const [foundActors, setFoundActors] = useState([]);
  const fetchActors = async (names: string[]) => {
    setLoading(true);
  };
  useEffect(() => {
    fetchActors(names);
  }, []);
  return (
    <div className={styles.FoundActors}>
      <h2 className={clsx(styles.foundActorsTitle, 'mb-20')}>
        Detected actors info:
      </h2>

      {loading ? (
        <div className={styles.FoundActorsWrapper}>
          {Array(6).fill(<ActorLoaderCard />)}
        </div>
      ) : foundActors.length ? (
        <div className={styles.FoundActorsWrapper}>
          {foundActors.map((actor) => (
            <ActorCard {...actor} />
          ))}
        </div>
      ) : (
        <div className={styles.NotFoundWrapper}>
          <h2>Could not find actors</h2>
        </div>
      )}
    </div>
  );
};

export default FoundActors;
