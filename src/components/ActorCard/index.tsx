import { ActorInfo } from '@/types';
import clsx from 'clsx';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './actorCard.module.scss';

interface ActorCardProps extends ActorInfo {}

const ActorCard: FC<ActorCardProps> = ({
  photo,
  name,
  link,
  birthDay,
  birthPlace
}) => {
  return (
    <NavLink
      to={`/actorinfo/${name?.split(' ').join('_')}`}
      className={clsx(
        styles.ActorCard,
        'btn__click',
        'hover__border',
        'tab__focus'
      )}
      onClick={(e) => e.currentTarget.blur()}
      tabIndex={0}
    >
      <div className={clsx(styles.imgWrap, 'mr-15')}>
        <img src={photo} alt={name} />
      </div>
      <div className={styles.cardRight}>
        <div className={styles.nameWrapper}>
          <h2 className={styles.actorName}>{name}</h2>
          <div className={styles.gradientStripe} />
        </div>
        <div className={clsx(styles.shortInfo, 'mt-15')}>
          <p className={styles.text}>
            <span>Birthday: </span>
            {birthDay}
          </p>
          <p className={styles.text}>
            <span>Birthplace: </span>
            {birthPlace}
          </p>
        </div>
      </div>
    </NavLink>
  );
};
export default ActorCard;

export const ActorLoaderCard: FC = () => {
  return (
    <div className={styles.ActorLoaderCard}>
      <div className={clsx(styles.imgWrap, 'mr-15')} />
      <div className={styles.cardRight}>
        <div className={styles.nameWrapper}>
          <div className={clsx(styles.loaderName, styles.shimmerText)} />
          <div className={styles.gradientStripe} />
        </div>
        <div className={clsx(styles.textPreloaderWrapper, 'mt-15')}>
          <div className={clsx(styles.text, styles.shimmerText)} />
          <div className={clsx(styles.text, styles.shimmerText)} />
          <div className={clsx(styles.text, styles.shimmerText)} />
        </div>
      </div>
    </div>
  );
};
