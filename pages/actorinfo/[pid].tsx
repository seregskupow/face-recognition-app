import ActorPageComponent from '@/components/ActorPageComponent';
import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from './actorPage.module.scss';

const ActorPage: FC = () => {
  const router = useRouter();
  const { pid } = router.query;
  const actorName = (pid as string)?.split('_').join(' ');
  return (
    <div className={styles.Page}>
      <ActorPageComponent actorName={actorName} />
    </div>
  );
};

export default ActorPage;
