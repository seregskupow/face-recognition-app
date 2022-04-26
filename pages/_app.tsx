import '../styles/global.scss';
import type { AppProps } from 'next/app';
import { useAuth } from '@/hooks/auth.hook';
import { AuthContext } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import NavBar from '@/components/NavBar';
import Toast from '@/components/UI/Toast';
import { useActions } from '@/store/useActions';
import { ReactElement, ReactNode, useEffect, useRef } from 'react';
import { store, wrapper } from '@/store/index';
import { injectStore } from '@/api';
import { Provider } from 'react-redux';
import { progressBar } from '@/utils/progressBar';
import { useRouter } from 'next/router';
import React from 'react';
import { NextPage } from 'next';

injectStore(store);

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();
  const { logIn, logOut, token, userId, userName, email, ready } = useAuth();

  const isAuth = !!token;

  const { authenticateUser } = useActions();

  const getLayout = Component.getLayout ?? ((page) => page);
  //const routes = useRoutes(!!token, state?.backgroundLocation);
  const { setMessage } = useActions();
  useEffect(() => {
    authenticateUser();
    progressBar.on(router);
    if (typeof document === 'undefined') {
      React.useLayoutEffect = React.useEffect;
    }
    return () => {
      progressBar.off(router);
    };
  }, []);
  return (
    <>
      <AuthContext.Provider
        value={{
          token,
          userId,
          userName,
          email,
          logIn,
          logOut,
          isAuth,
        }}
      >
        <Toast />
        {getLayout(<Component {...pageProps} />)}
      </AuthContext.Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
