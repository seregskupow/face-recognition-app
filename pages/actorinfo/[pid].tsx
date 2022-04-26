import ActorPageComponent from '@/components/ActorPageComponent';
import MainLayout from '@/components/Layouts/MainLayout';
import { useRouter } from 'next/router';
import { FC, ReactElement } from 'react';
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

(ActorPage as any).getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};

export default ActorPage;
