import Link from 'next/link';
import ImageComponent from '@/components/UI/Image';
import { userSelector } from '@/store/slices/user.slice';
import { useActions } from '@/store/useActions';
import { getFirstLetters } from '@/utils/getFirstLetters';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FC, Fragment, memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { CgChevronDown } from 'react-icons/cg';
import styles from './desktopMenu.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { BiLogOut, BiUserCircle } from 'react-icons/bi';
import Button from '@/components/UI/Button';

const linkData = [
  {
    to: '/',
    link: 'Home',
  },
  {
    to: '/facematch',
    link: 'Facematch',
  },
  {
    to: '/history',
    link: 'History',
  },
];

const DesktopMenu: FC = () => {
  const { avatar, name: userName } = useSelector(userSelector);
  const router = useRouter();
  const { logoutUser } = useActions();
  const accBtn = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleAccBtnClick = (e) => {
    if (accBtn?.current?.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const logoutHandler = () => {
    logoutUser();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleAccBtnClick);
    return () => {
      document.removeEventListener('mousedown', handleAccBtnClick);
    };
  }, []);

  return (
    <Fragment>
      <div className={styles.Logo}>
        <span>RecoFun</span>{' '}
      </div>
      <header className={styles.Header}>
        <nav className={styles.Nav}>
          {linkData.map((link, index) => (
            <li
              key={index * Math.random() * (9999 - 1000) * 1000}
              className={styles.MenuItem}
            >
              <Link href={link.to}>
                <a
                  className={clsx(
                    styles.MenuLink,
                    router.pathname === link.to && styles.ActiveLink,
                    'btn__click'
                  )}
                >
                  {link.link}
                </a>
              </Link>
            </li>
          ))}
        </nav>
        <div className={styles.AccountBtnContainer} ref={accBtn}>
          <button
            className={clsx(styles.AccountBtn, 'btn__click')}
            onClick={() => setOpen(!open)}
          >
            {avatar ? (
              <ImageComponent
                src={avatar}
                className={styles.UserAvatar}
                alt='user avatar'
              />
            ) : (
              <div className={styles.Placeholder}>
                {userName && getFirstLetters(userName)}
              </div>
            )}
            <div className={styles.Arrow}>
              <CgChevronDown data-open={open} />
            </div>
          </button>
          <AnimatePresence exitBeforeEnter>
            {open && (
              <DropdownMenu userName={userName} logout={logoutHandler} />
            )}
          </AnimatePresence>
        </div>
      </header>
    </Fragment>
  );
};

export default DesktopMenu;

interface DropdownMenuProps {
  userName: string;
  logout: () => void;
}

const DropdownMenu: FC<DropdownMenuProps> = memo(({ userName, logout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0.5 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.5 }}
      transition={{ duration: 0.1 }}
      className={styles.DropdownMenu}
    >
      {svgGradient()}
      <div className={clsx(styles.DropdownItem, styles.UserNameItem)}>
        <div className={styles.Icon}>
          <BiUserCircle />
        </div>
        <p className={styles.UserName}>{userName}</p>
      </div>
      <div className={styles.DropdownItem}>
        <div className={styles.Icon}>
          <BiLogOut />
        </div>
        <Button text='Logout' event={logout} />
      </div>
    </motion.div>
  );
});

const svgGradient = () => (
  <svg width='0' height='0' style={{ display: 'block' }}>
    <linearGradient id='blue-violet' gradientTransform='rotate(25)'>
      <stop offset='30%' stopColor='#2876f9' />
      <stop offset='74%' stopColor='#6d17cb' />
    </linearGradient>
  </svg>
);
