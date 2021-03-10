import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdClose } from 'react-icons/md';
import { AuthContext } from '../context/AuthContext';
import linkData from '../data/linkData.json';
import { ReactComponent as FaceIcon } from '../images/icons/face-recognition.svg';
import { ReactComponent as HistoryIcon } from '../images/icons/history.svg';
import { ReactComponent as HomeIcon } from '../images/icons/home.svg';
import { addFunctionToResize } from '../utils/eventListeners';

const icons = [
  <HomeIcon className="mobile-menu-icon" />,
  <FaceIcon className="mobile-menu-icon" />,
  <HistoryIcon className="mobile-menu-icon" />,
];
const NavBar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [toggle, setToggle] = useState(false);
  const [isMob, setMob] = useState(false);
  const menuHandler = () => {
    setToggle((toggle) => !toggle);
  };
  const isMobile = () => {
    if (window.innerWidth > 900) return setMob(false);
    return setMob(true);
  };
  useEffect(() => {
    window.addEventListener('resize', isMobile);
    return () => {
      window.removeEventListener('resize', isMobile);
    };
  }, []);
  const clickHandler = (event) => {
    event.preventDefault();
    auth.logOut();
    history.push('/');
  };
  if (!isMob) {
    return (
      <>
        <Logo className="logo">RecoFun</Logo>
        <header>
          <nav>
            {linkData.map((link, index) => (
              <li
                key={index * Math.random() * (9999 - 1000) * 1000}
                className="menu-item"
              >
                <NavLink
                  exact
                  to={link.to}
                  className="menu-link"
                  activeClassName="activelink"
                >
                  {link.link}
                </NavLink>
              </li>
            ))}
            <li className="menu-item">
              <LogoutLink href="/" className="" onClick={clickHandler}>
                LogOut
              </LogoutLink>
            </li>
          </nav>
        </header>
      </>
    );
  }
  return (
    <>
      <Logo className="logo">RecoFun</Logo>
      <Burger onClick={menuHandler}>
        {toggle === false ? <GiHamburgerMenu /> : <MdClose />}
      </Burger>
      <SideMenu display={toggle}>
        <SideMenuWrapper>
          <LogoutLink href="/" className="" onClick={clickHandler}>
            LogOut
          </LogoutLink>
        </SideMenuWrapper>
      </SideMenu>
      <MobileNavigation className="mobile-navigation">
        <div className="mobile-navigation-wrapp">
          {linkData.map((link, index) => (
            <li
              key={Math.random() * (9999 - 1000) * 1000}
              className="mobile-menu-item"
            >
              <NavLink
                exact
                to={link.to}
                className="mobile-menu-link"
                activeClassName="mobile-activelink"
              >
                <div className="mobile-link-inside">
                  {icons[index]}
                </div>
              </NavLink>
            </li>
          ))}
        </div>
      </MobileNavigation>
    </>
  );
};
const Logo = styled.h1`
  position: fixed;
  top: 0px;
  left: 0px;
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
const Burger = styled.div`
  position: fixed;
  top: 20px;
  right: 8px;
  height: 30px;
  font-size: 40px;
  color: white;
  cursor: pointer;
  z-index: 51;
`;
const SideMenu = styled.div`
  position: fixed;
  top: 24px;
  right: ${(props) => (props.display === false ? '-100%' : '0')};
  width: 50vw;
  height: 100vh;
  z-index: 50;
  background: rgba(0, 0, 0, 0.756);
  transition: all 0.3s ease-in-out;
`;
const SideMenuWrapper = styled.div`
width:100%;
display:flex;
justify-content:center;
margin-top:70px;
`;
const LogoutLink = styled.div`
background-color: #990000;
background-image: linear-gradient(147deg, #990000 0%, #ff0000 74%);
color:white;
padding:10px 15px;
border-radius:15px;
cursor:pointer;
`;
export default NavBar;
