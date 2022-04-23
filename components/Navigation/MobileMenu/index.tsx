import { userSelector } from '@/store/slices/user.slice';
import { useActions } from '@/store/useActions';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaceReco } from '@/images/icons/face-recognition.js';
import { History } from '@/images/icons/history.js';
import { Home } from '@/images/icons/home.js';
import MenuIcon from '@/images/icons/menu.svg';
import styles from './mobileMenu.module.scss';

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

  const logoutHandler = () => {
    logoutUser();
  };
  return (
    <>
      {/* <div ref={menu} className='side-menu'>
         <div className='side-menu-wrapper'>
          <div className='user-profile'>
            <div className='user-data'>
              <p className='logged-as'>Logged in as:</p>
              <p>
                <span className='user-name'>{userName}</span> <br />{' '}
                <span className='user-email'>{email}</span>
              </p>
            </div>
            <div className='logout-wrapper'>
              {' '}
              <div onClick={logoutHandler}>LogOut</div>
            </div>
          </div>
        </div> 
      </div> */}
      <div className={styles.MobileNavWrapper}>
        <nav className={styles.MobileNav}>
          {linkData.map((link) => (
            <li key={link.to} className={styles.NavItem}>
              <Link href={link.to}>
                <a
                  className={clsx(
                    styles.NavLink,
                    router.pathname === link.to && styles.ActiveLink
                  )}
                >
                  {link.icon}
                </a>
              </Link>
            </li>
          ))}
          <li className={styles.NavItem}>
            <div
              // ref={menuBtn}
              className={clsx(styles.NavLink, styles.ToggleMenuBtn)}
              // onClick={menuHandler}
            >
              <MenuIcon />
            </div>
          </li>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
