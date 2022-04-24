import ImageComponent from '@/components/UI/Image';
import { userSelector } from '@/store/slices/user.slice';
import { useActions } from '@/store/useActions';
import { getFirstLetters } from '@/utils/getFirstLetters';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import styles from './desktopMenu.module.scss';

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
  const logoutHandler = () => {
    logoutUser();
  };
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
        <div className={clsx(styles.UsernameIcon, 'btn__click')}>
          {avatar ? (
            <ImageComponent
              src={avatar}
              className={styles.UserAvatar}
              alt='user avatar'
            />
          ) : (
            <span>{userName && getFirstLetters(userName)}</span>
          )}
        </div>
      </header>
    </Fragment>
  );
};

export default DesktopMenu;
