import { FC, Fragment, useRef, useState } from 'react';

import clsx from 'clsx';
import { MdOutlineClose } from 'react-icons/md';

import ActorCardSmall from '@/components/ActorCardSmall';
import Button from '@/components/UI/Button';
import { ActorInfo } from '@/types/index';
import PlaceHolder from '../../../images/film_placeholder.png';

import styles from './historyResultBlock.module.scss';
import { Link, useLocation } from 'react-router-dom';
import Image from '@/components/UI/Image';

interface HistoryResultBlockProps {
  actors: ActorInfo[];
  usedImage: string;
}

const HistoryResultBlock: FC<HistoryResultBlockProps> = ({
  actors,
  usedImage
}) => {
  const location = useLocation();
  const bgRef = useRef<HTMLDivElement>(null);
  const [showActors, setShowActors] = useState(false);
  const onBGClickHandler = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (bgRef?.current) {
      if (target === bgRef.current) setShowActors(false);
    }
  };
  return (
    <div className={clsx(styles.ResultBlock)}>
      <div className={styles.inner}>
        <div style={{ textAlign: 'center' }}>
          {/* <img
            src={`${process.env.REACT_APP_BACKEND_ADRESS}/${usedImage}`}
            className={styles.ResultImage}
            alt=""
            onError={(e) => (e.currentTarget.src = PlaceHolder)}
          /> */}
          <Image
            src={`${process.env.REACT_APP_BACKEND_ADRESS}/${usedImage}`}
            className={styles.ResultImage}
          />
        </div>
        <div className={clsx('mt-10')}>
          <Button text="show actors" event={() => setShowActors(true)} />
          <Button text="share" color="contrast" />
        </div>
      </div>
      {showActors && (
        <Fragment>
          <div className={styles.ActorsContainer} onClick={onBGClickHandler}>
            <div ref={bgRef} className={styles.inner}>
              <div className={styles.actorsWrapper}>
                {actors.map((actor) => (
                  <div className={styles.item}>
                    <Link
                      key={actor.id}
                      to={`/actorinfo/${actor.name?.split(' ').join('_')}`}
                      state={{ backgroundLocation: location }}
                    >
                      <ActorCardSmall link="" {...actor} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className={clsx(
              styles.HideActorsBtn,
              'btn__click',
              'hover__border'
            )}
            onClick={() => setShowActors(false)}
          >
            <MdOutlineClose />
          </button>
        </Fragment>
      )}
    </div>
  );
};
export default HistoryResultBlock;
