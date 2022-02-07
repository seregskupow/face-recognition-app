import { ActorsService } from '@/api';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import GoogleMap from '@/components/GoogleMap';
import styles from './actorInfoModal.module.scss';
import ActorPageComponent from '@/components/ActorPageComponent';
import Button from '@/components/UI/Button';

const ActorInfoModal: FC = () => {
  const overlayID = 'actor-modal-bg;';
  const navigate = useNavigate();
  const closeModalBGHandler = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === overlayID) {
      navigate(-1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  return ReactDOM.createPortal(
    <div
      id={overlayID}
      className={styles.ActorInfoModalOverlay}
      onClick={closeModalBGHandler}
    >
      <div className={styles.ModalBody}>
        <div className={styles.BackBtn} onClick={() => navigate(-1)}>
          <Button text="&#x27F5; Back" />
        </div>
        <ActorPageComponent />
      </div>
    </div>,
    document.body
  );
};

export default ActorInfoModal;
