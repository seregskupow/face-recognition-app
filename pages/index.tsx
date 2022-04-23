import React, {
  Component,
  FC,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import Link from 'next/link';
// @ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import Background from '@/utils/Background';
import 'react-awesome-button/dist/themes/theme-blue.css';
import MainLayout from '@/components/Layouts/MainLayout';
import { useSelector } from 'react-redux';
import { authSelector } from '@/store/slices/auth.slice';
import { useDetectMobile } from '@/hooks/useDetectMobile';

const Home: FC = () => {
  const { loggedIn } = useSelector(authSelector);
  const isMobile = useDetectMobile();
  const ref = useRef<HTMLDivElement>(null);
  const initBackground = () => {
    const back = new Background(ref.current);
    back.start();
  };
  useEffect(() => {
    // !isMobile && ref.current && initBackground();
  }, [isMobile]);
  return (
    <section ref={ref} id='home'>
      <div className='save-background' />
      <div className='home-wrapper'>
        <h1 className='mb-10'>Recognize actors by photo</h1>
        <h3 className='mb-10'>over 1000 actors in our database</h3>
        <Link href={loggedIn ? '/auth/login' : '/auth/login'}>
          <a className='menu-link'>
            <AwesomeButton type='primary' size='auto' button-hover-pressure='3'>
              {loggedIn ? 'Recognize actor' : 'Authorize to start'}
            </AwesomeButton>
          </a>
        </Link>
      </div>
    </section>
  );
};

(Home as any).getLayout = (page: ReactElement) => {
  return <MainLayout>{page}</MainLayout>;
};
export default Home;
