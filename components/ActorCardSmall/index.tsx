import { WikiActorInfo } from '@/types';
import clsx from 'clsx';
import { FC } from 'react';
import Image from '@/components/UI/Image';
import styles from './actorCardSmall.module.scss';

interface WikiCardProps extends WikiActorInfo {}

const WikiCard: FC<WikiCardProps> = ({ name, photo }) => (
  <div
    onClick={(e) => e.currentTarget.blur()}
    className={clsx(
      styles.WikiCard,
      'btn__click',
      'hover__border',
      'tab__focus'
    )}
    tabIndex={0}
  >
    <div className={styles.body}>
      <div className={styles.imgWrap}>
        <Image src={photo} />
        {/* <img src={photo} alt={name} /> */}
      </div>
      <div className={styles.name}>
        <p>{name}</p>
      </div>
    </div>
  </div>
);

export default WikiCard;

export const WikiLoaderCard = () => (
  <div className={styles.WikiPreloaderCard}>
    <div className={styles.body}>
      <div className={styles.imgWrap} />
      <div className={styles.name}></div>
    </div>
  </div>
);
