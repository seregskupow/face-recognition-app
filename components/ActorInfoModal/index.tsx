import { ActorsService } from '@/api';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Router, { useRouter } from 'next/router';
import useSWR from 'swr';
import GoogleMap from '@/components/GoogleMap';
import styles from './actorInfoModal.module.scss';
import ActorPageComponent from '@/components/ActorPageComponent';
import Button from '@/components/UI/Button';
import { motion } from 'framer-motion';

const opacityTransition = 200;

interface ActorInfoModalProps {
  actorName: string;
}

const ActorInfoModal: FC<ActorInfoModalProps> = ({ actorName }) => {
  const router = useRouter();
  const [close, setClose] = useState(false);
  const overlayID = 'actor-modal-bg;';

  const closeModal = () => {
    setClose(true);
    setTimeout(() => {
      // console.log({ router });
      router.back();
      // router.push(
      //   {
      //     pathname: '/history',
      //     query: {
      //       page: 2,
      //     },
      //   },
      //   undefined,
      //   { shallow: true }
      // );
    }, opacityTransition + 100);
  };
  const closeModalBGHandler = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === overlayID) {
      closeModal();
    }
  };

  useEffect(() => {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflowY = 'hidden';
    document.body.style.marginRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflowY = 'unset';
      document.body.style.marginRight = '0';
    };
  }, []);
  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: close ? 0 : 1 }}
      transition={{ duration: opacityTransition / 1000 }}
      id={overlayID}
      className={clsx(styles.ActorInfoModalOverlay)}
      onClick={closeModalBGHandler}
      style={{
        transition: `all ${opacityTransition}ms ease`,
      }}
    >
      <div className={styles.ModalBody}>
        <div className={styles.BackBtn} onClick={closeModal}>
          <Button text='&#x27F5; Back' />
        </div>
        <ActorPageComponent actorName={actorName} />
      </div>
    </motion.div>,
    document.body
  );
};

export default ActorInfoModal;
