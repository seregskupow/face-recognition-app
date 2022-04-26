import { userSelector } from '@/store/slices/user.slice';
import { useActions } from '@/store/useActions';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaceReco } from '@/images/icons/face-recognition.js';
import { History } from '@/images/icons/history.js';
import { Home } from '@/images/icons/home.js';
import MenuIcon from '@/images/icons/menu.svg';
import styles from './mobileMenu.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { BiLogOut } from 'react-icons/bi';
import Button from '@/components/UI/Button';
import ImageComponent from '@/components/UI/Image';
import { getFirstLetters } from '@/utils/getFirstLetters';

const linkData = [
  {
    to: '/',
    title: 'Home',
    icon: Home,
  },
  {
    to: '/facematch',
    title: 'Facematch',
    icon: FaceReco,
  },
  {
    to: '/history',
    title: 'History',
    icon: History,
  },
];

const MobileMenu: FC = () => {
  const menu = useRef<HTMLHeadingElement>(null);
  const { avatar, name: userName, email } = useSelector(userSelector);
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
    <div className={styles.MobileNavWrapper} ref={accBtn}>
      {svgGradient()}
      <nav className={styles.MobileNav}>
        {linkData.map((link) => (
          <li key={link.to} className={styles.NavItem}>
            <Link href={link.to}>
              <a
                className={clsx(
                  styles.NavLink,
                  router.pathname === link.to && styles.ActiveLink,
                  'btn__click'
                )}
              >
                {link.icon}
              </a>
            </Link>
          </li>
        ))}
        <li className={styles.NavItem}>
          <div
            className={clsx(styles.NavLink, styles.ToggleMenuBtn, 'btn__click')}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </div>
        </li>
      </nav>
      <AnimatePresence exitBeforeEnter>
        {open && (
          <FlyoutMenu
            userName={userName}
            userAvatar={avatar}
            logout={logoutHandler}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu;

interface FlyoutMenuProps {
  userName: string;
  userAvatar: string | null;
  logout: () => void;
}

const FlyoutMenu: FC<FlyoutMenuProps> = memo(
  ({ userName, userAvatar, logout }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ duration: 0.1 }}
        className={styles.FlyoutMenu}
      >
        {svgGradient()}
        <div className={styles.UserInfo}>
          {userAvatar ? (
            <div className={styles.UserAvatarWrapper}>
              <ImageComponent
                src={userAvatar}
                className={styles.UserAvatar}
                alt='user avatar'
              />
            </div>
          ) : (
            <span className={styles.Placeholder}>
              {userName && getFirstLetters(userName)}
            </span>
          )}
          <p className={styles.UserName}>{userName}</p>
        </div>
        <div className={styles.FlyoutItem}>
          <div className={styles.Icon}>
            <BiLogOut />
          </div>
          <Button text='Logout' event={logout} />
        </div>
      </motion.div>
    );
  }
);

const svgGradient = () => (
  <svg width='0' height='0' style={{ display: 'block' }}>
    <linearGradient id='blue-violet' gradientTransform='rotate(25)'>
      <stop offset='30%' stopColor='#2876f9' />
      <stop offset='74%' stopColor='#6d17cb' />
    </linearGradient>
  </svg>
);
