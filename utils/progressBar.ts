import { NextRouter } from 'next/router';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: false });

const handleStart = () => {
  NProgress.start();
};
const handleStop = () => {
  NProgress.done();
};

export const progressBar = {
  on: (router: NextRouter) => {
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);
  },
  off: (router: NextRouter) => {
    router.events.off('routeChangeStart', handleStart);
    router.events.off('routeChangeComplete', handleStop);
    router.events.off('routeChangeError', handleStop);
  },
};
