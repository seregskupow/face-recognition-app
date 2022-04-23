import { ActorsService } from '@/api';
import clsx from 'clsx';
import { FC } from 'react';
import useSWR from 'swr';
import GoogleMap from '@/components/GoogleMap';
import styles from './actorPageComponent.module.scss';
import ImageComponent from '../UI/Image';
import { useRouter } from 'next/router';

interface ActorPageComponentProps {
  actorName: string;
}
const ActorPageComponent: FC<ActorPageComponentProps> = ({ actorName }) => {
  const {
    data: actorInfo,
    isValidating,
    error,
  } = useSWR(
    ['actorInfo', actorName],
    (key, actorName) => ActorsService.getActorinfo(actorName),
    { revalidateOnFocus: false }
  );
  const filmNames = actorInfo?.films.map((film) => film.title);
  const {
    data: filmsData,
    isValidating: filmsLoaing,
    error: filmsError,
  } = useSWR(['filmsData', filmNames], (key, filmNames) => {
    ActorsService.fetchFilms();
  });
  return (
    <>
      <div className={clsx(styles.ActorName, 'mb-20')}>{actorInfo?.name}</div>
      <div className={styles.ActorMainInfo}>
        <div className={styles.ActorPhoto}>
          <div className={styles.PhotoBackground}>
            <div className={styles.ImageWrapper}>
              {actorInfo?.photo && (
                <ImageComponent
                  src={actorInfo.photo as string}
                  alt='recognition'
                />
              )}
              {/* <img src={actorInfo?.photo} alt="recognition" /> */}
            </div>
          </div>
        </div>
        <div className={styles.Shortinfo}>
          <div>
            <p className={clsx(styles.text, 'mb-10')}>
              <span>BirthDate: </span>
              {actorInfo?.birthDay || 'unavailable'}
            </p>
            <p className={clsx(styles.text, 'mb-20')}>
              <span>BirthPlace: </span>
              {actorInfo?.birthPlace || 'unavailable'}
            </p>
          </div>
          <div>
            <GoogleMap
              address={(actorInfo?.birthPlace as string) || 'unavailable'}
            />
          </div>
        </div>
      </div>
      <div className={clsx(styles.Biography, 'mt-20')}>
        <h2 className={clsx(styles.title, 'mb-10')}>Biography:</h2>
        <p className={styles.bio}>{actorInfo?.biography}</p>
      </div>
    </>
  );
};

export default ActorPageComponent;
