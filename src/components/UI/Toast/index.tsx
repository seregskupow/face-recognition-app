/* eslint-disable react/display-name */
import {
  Message,
  messageSelector,
  MessageType
} from '@/store/slices/message.slice';
import React, { useEffect, FC, Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useActions } from '@/store/useActions';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import { MdErrorOutline, MdClose, MdInfoOutline } from 'react-icons/md';
import { VscWarning } from 'react-icons/vsc';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import styles from './toast.module.scss';
interface IToastProps {
  autoDelete?: boolean;
  position?: 'top__right' | 'top__left' | 'bottom__right' | 'bottom__left';
  autoDeleteTime?: number;
}

const Toast: FC<IToastProps> = ({
  autoDelete = true,
  position = 'top__right',
  autoDeleteTime = 5000
}) => {
  const { messageArr } = useSelector(messageSelector);
  const { removeMessage } = useActions();

  useEffect(() => {
    messageArr.length > 5 && removeMessage(messageArr[0].id);
    const interval = setInterval(() => {
      if (autoDelete && messageArr?.length) {
        removeMessage(messageArr[0].id);
      }
    }, autoDeleteTime);
    return () => {
      clearInterval(interval);
    };
  }, [messageArr, autoDelete, autoDeleteTime, removeMessage]);
  return (
    <Fragment>
      <AnimateSharedLayout>
        <motion.div layout className={styles.notification__container}>
          <AnimatePresence>
            {messageArr?.length &&
              messageArr.map((message) => (
                <Msg key={message.id} message={message} position={position} />
              ))}
          </AnimatePresence>
        </motion.div>
      </AnimateSharedLayout>
    </Fragment>
  );
};

export default Toast;

const Icontype = (type: MessageType) => {
  switch (type) {
    case 'error':
      return <MdErrorOutline />;
    case 'warning':
      return <VscWarning />;
    case 'info':
      return <MdInfoOutline />;
    case 'success':
      return <AiOutlineCheckCircle />;
  }
};

const Msg: FC<any> = React.memo(({ message, position }) => {
  const { removeMessage } = useActions();
  const [direction, setDerection] = useState('left');
  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: -10, right: 10 }}
      dragElastic={0.1}
      initial={{
        opacity: 0,
        x: position === 'top__right' || 'bottom__right' ? -150 : 150
      }}
      transition={{ ease: 'backOut' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ x: direction === 'left' ? -200 : 200, opacity: 0 }}
      onDragEnd={(event, info) => {
        info.offset.x > 0 ? setDerection('right') : setDerection('left');
        removeMessage(message.id);
      }}
      className={`${styles.notification} ${styles[message.type]}`}
    >
      <div className={styles.icon}>
        <div className={styles.icon__bg}>{Icontype(message.type)}</div>
      </div>
      <div className={styles.message}>
        <p>{message.msg}</p>
      </div>
      <div className={styles.close__btn}>
        {' '}
        <button
          className="btn__click"
          onClick={() => removeMessage(message.id)}
        >
          <MdClose />
        </button>
      </div>
    </motion.div>
  );
});
