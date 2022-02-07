import ActorPageComponent from '@/components/ActorPageComponent';
import { FC } from 'react';
import styles from './actorPage.module.scss';

const ActorPage: FC = () => {
  return (
    <div className={styles.Page}>
      <ActorPageComponent />
    </div>
  );
};

export default ActorPage;
