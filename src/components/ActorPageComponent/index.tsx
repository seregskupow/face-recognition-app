import { ActorsService } from '@/api';
import clsx from 'clsx';
import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import GoogleMap from '@/components/GoogleMap';
import styles from './actorPageComponent.module.scss';

const ActorPageComponent: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<'id'>();
  const actorName = (id as string).split('_').join(' ');
  const {
    data: actorInfo,
    isValidating,
    error
  } = useSWR(
    ['actorInfo', actorName],
    (key, actorName) => ActorsService.getActorinfo(actorName),
    { revalidateOnFocus: false }
  );
  const filmNames = actorInfo?.films.map((film) => film.filmName);
  const {
    data: filmsData,
    isValidating: filmsLoaing,
    error: filmsError
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
              <img src={actorInfo?.photo} alt="recognition" />
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
