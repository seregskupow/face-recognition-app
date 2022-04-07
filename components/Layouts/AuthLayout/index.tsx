import styles from './authLayout.module.scss';
import { FC, Fragment } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';

const AuthLayout: FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <Fragment>
      <div className={styles.AuthContainer}>
        <div className={styles.AuthContainer__Inner}>
          <AnimatePresence exitBeforeEnter>{children}</AnimatePresence>
        </div>
      </div>
    </Fragment>
  );
};
export default AuthLayout;
export const variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};
