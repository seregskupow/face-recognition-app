import ActorInfoModal from '@/components/ActorInfoModal';
import { useRouter } from 'next/router';
import { FC, Fragment } from 'react';

const WithActorModal: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  return (
    <Fragment>
      {children}
      {router.query.actor && (
        <ActorInfoModal
          actorName={(router.query.actor as string)?.split('_').join(' ')}
        />
      )}
    </Fragment>
  );
};
export default WithActorModal;
