import { FC, Fragment, useRef, useState } from 'react';

import clsx from 'clsx';
import { MdOutlineClose } from 'react-icons/md';

import ActorCardSmall from '@/components/ActorCardSmall';
import Button from '@/components/UI/Button';
import { ActorInfo } from '@/types/index';
import PlaceHolder from '../../../images/film_placeholder.png';

import styles from './historyResultBlock.module.scss';
import Link from 'next/link';
import Image from '@/components/UI/Image';
import { AnimatePresence, motion } from 'framer-motion';

interface HistoryResultBlockProps {
  actors: ActorInfo[];
  usedImage: string;
}

const HistoryResultBlock: FC<HistoryResultBlockProps> = ({
  actors,
  usedImage,
}) => {
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
        <div className={styles.ReasultImageWrapper}>
          {/* <img
            src={`${process.env.REACT_APP_BACKEND_ADRESS}/${usedImage}`}
            className={styles.ResultImage}
            alt=""
            onError={(e) => (e.currentTarget.src = PlaceHolder)}
          /> */}
          <Image
            src={`${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/${usedImage}`}
            className={styles.ResultImage}
            alt='usedImage'
          />
        </div>
        <div className={clsx('mt-10')}>
          <Button text='show actors' event={() => setShowActors(true)} />
          <Button text='share' color='contrast' />
        </div>
      </div>
      {/* <AnimatePresence> */}
      {showActors && (
        <motion.div
          className={clsx(styles.ActorsContainer)}
          onClick={onBGClickHandler}
          key={usedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div ref={bgRef} className={styles.inner}>
            <div className={styles.actorsWrapper}>
              {actors.map((actor) => (
                <div key={actor.id} className={styles.item}>
                  <Link
                    scroll={false}
                    href={`/history/?actor=${actor.name?.split(' ').join('_')}`}
                    as={`/actorinfo/${actor.name?.split(' ').join('_')}`}
                  >
                    <a>
                      <ActorCardSmall link='' {...actor} />
                    </a>
                  </Link>
                </div>
              ))}
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
        </motion.div>
      )}
      {/* </AnimatePresence> */}
    </div>
  );
};
export default HistoryResultBlock;
