import { useState, useContext, useEffect, useRef, SyntheticEvent } from 'react';
import Link from 'next/link';

import styled from 'styled-components';
import { AuthContext } from '../context/AuthContext';
import linkData from '../data/linkData.json';
import { FaceReco } from '../images/icons/face-recognition.js';
import { History } from '../images/icons/history.js';
import { Home } from '../images/icons/home.js';
import MenuIcon from '../images/icons/menu.svg';
import { useRouter } from 'next/router';
import clsx from 'clsx';

const icons = [FaceReco, History, Home];
const NavBar = () => {
  const router = useRouter();
  const menu = useRef<HTMLHeadingElement>(null);
  const menuBtn = useRef<HTMLHeadingElement>(null);
  const { logOut, userName, email } = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [isMob, setMob] = useState(false);
  const menuHandler = () => {
    setToggle((disp) => !disp);
  };
  const getFirstLetters = (str: any) =>
    str
      .split(' ')
      .map((item: any) => item.charAt(0))
      .join('');
  const isMobile = () => {
    if (window.innerWidth > 900) return setMob(false);
    return setMob(true);
  };
  const handleClick = (e: MouseEvent) => {
    const el = e.currentTarget;
    if (menu.current && menuBtn.current) {
      if (
        menu.current.contains(el as Node) ||
        menuBtn.current.contains(el as Node)
      ) {
        return;
      }
      setToggle(false);
    }
  };
  useEffect(() => {
    isMobile();
    window.addEventListener('resize', isMobile);
    document.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('resize', isMobile);
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);
  const clickHandler = (event: SyntheticEvent) => {
    event.preventDefault();
    logOut();
    router.push('/');
  };
  if (!isMob) {
    return (
      <>
        <Logo className='logo'>RecoFun</Logo>
        <header className='header'>
          <div className='user-name-icon'>
            <span>{userName && getFirstLetters(userName)}</span>
          </div>
          <nav>
            {linkData.map((link, index) => (
              <li
                key={index * Math.random() * (9999 - 1000) * 1000}
                className='menu-item'
              >
                <Link href={link.to}>
                  <a
                    className={clsx(
                      'menu-link',
                      router.pathname === link.to && 'activelink'
                    )}
                  >
                    {link.link}
                  </a>
                </Link>
              </li>
            ))}
            <li className='menu-item'>
              <LogoutLink onClick={clickHandler}>LogOut</LogoutLink>
            </li>
          </nav>
        </header>
      </>
    );
  }
  return (
    <>
      <Logo className='logo'>RecoFun</Logo>
      <MobMenu ref={menu} className='side-menu' display={toggle}>
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
              <LogoutLink onClick={clickHandler}>LogOut</LogoutLink>
            </div>
          </div>
        </div>
      </MobMenu>
      <MobileNavigation className='mobile-navigation'>
        <div className='mobile-navigation-wrapp'>
          {linkData.map((link, index) => (
            <li
              key={Math.random() * (9999 - 1000) * 1000}
              className='mobile-menu-item'
            >
              <Link href={link.to}>
                <a
                  className={clsx(
                    'mobile-menu-link',
                    router.pathname === link.to && 'mobile-activelink'
                  )}
                >
                  {icons[index]}
                </a>
              </Link>
            </li>
          ))}
          <li className='mobile-menu-item'>
            <div
              ref={menuBtn}
              className='mobile-menu-link menu-btn'
              onClick={menuHandler}
            >
              <MenuIcon className='mobile-menu-icon' />
            </div>
          </li>
        </div>
      </MobileNavigation>
    </>
  );
};
const Logo = styled.h1`
  position: fixed;
  top: 0px;
  right: 0px;
  width: 100%;
  font-size: 0.75em;
  background-color: #2876f9;
  background-image: linear-gradient(315deg, #2876f9 30%, #6d17cb 74%);
  color: #fff;
  display: inline;
  padding: 5px;
  text-align: center;
  z-index: 102;
`;
const MobileNavigation = styled.div`
  position: fixed;
  bottom: 10px;
  font-size: 12px;
`;
const MobMenu = styled.div<{ display: boolean }>`
  bottom: ${(props) => (props.display === false ? '-100%' : '0')};
`;
const LogoutLink = styled.div`
  background-color: #990000;
  background-image: linear-gradient(147deg, #990000 0%, #ff0000 74%);
  color: white;
  padding: 10px 15px;
  border-radius: 15px;

  font-size: 1.5rem;
  cursor: pointer;
`;
export default NavBar;
