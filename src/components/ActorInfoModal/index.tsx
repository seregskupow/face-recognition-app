import { ActorsService } from '@/api';
import clsx from 'clsx';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import styles from './actorInfoModal.module.scss';

const ActorInfoModal: FC = () => {
  const overlayID = 'actor-modal-bg;';
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
            <p className={styles.text}>
              <span>BirthDate: </span>
              {actorInfo?.birthDay || 'unavailable'}
            </p>
            <p className={styles.text}>
              <span>BirthPlace: </span>
              {actorInfo?.birthPlace || 'unavailable'}
            </p>
          </div>
        </div>
        <div className={clsx(styles.Biography, 'mt-20')}>
          <h2 className={clsx(styles.title, 'mb-10')}>Biography:</h2>
          <p className={styles.bio}>{actorInfo?.biography}</p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ActorInfoModal;
