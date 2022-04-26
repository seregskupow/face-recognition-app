import { FC, ReactElement, useContext, useEffect, useState } from 'react';

import { AxiosError } from 'axios';
import useSWR, { unstable_serialize } from 'swr';
import clsx from 'clsx';

import { UserService } from '@/api';

import { LoadHistoryResponse } from '@/types/index';

import { useActions } from '@/store/useActions';

import HistoryItem from '@/components/Pages/HistoryPage/HistoryItem';

import styles from './history.module.scss';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import WithActorModal from '@/components/Layouts/WithActorModal';
import MainLayout from '@/components/Layouts/MainLayout';
import Pagination from '@/components/UI/Pagination';
import queryParamToString from '@/utils/queryParamToString';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { cookiesTostring } from '@/utils/cookiesToString';
import { UserHistoryResponseDto } from 'api/dto/userHistory.dto';
import deepEqual from 'fast-deep-equal';
import useLoadersAmount from '@/hooks/useLoadersAmount';
import { HistoryResultBlockLoader } from '@/components/Pages/HistoryPage/HistoryResultBlock';
interface HistoryProps {
  serverData: UserHistoryResponseDto;
}

const History: FC<HistoryProps> = ({ serverData }) => {
  const router = useRouter();
  const [serverQuery] = useState(router.query);
  const { setMessage } = useActions();
  const loadersAmount =
    typeof window === 'undefined' ? 0 : useLoadersAmount('HistoryBlock');
  const [currentPage, setCurrentPage] = useState(serverData.currentPage);
  const { data, isValidating, error } = useSWR(
    ['userHistory', currentPage],
    (key, page) => UserService.loadHistory(page),
    {
      revalidateOnFocus: false,
      fallback: {
        [unstable_serialize(['userHistory', serverData.currentPage])]:
          serverData,
      },
    }
  );

  const changePage = (page: number) => {
    setCurrentPage(page);
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          page: page + 1 || 1,
        },
      },
      undefined,
      { shallow: true }
    );
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  };

  useEffect(() => {
    changePage(serverData.currentPage);
  }, []);
  //Prevent SWR fetch when ActorModal opens and query.page becomes undefined
  useEffect(() => {
    const { query, pathname, asPath } = router;
    const thisPagePathname = pathname;
    const currentPathName = asPath;

    const { totalPages } = serverData;

    if (!currentPathName.includes(thisPagePathname)) return;
    console.log({ Quer: query });
    if (query.page) {
      const page = parseInt(queryParamToString(query.page), 10);
      console.log({ page });
      console.log({ totalPages });
      if (page <= 0 || page > totalPages + 1) return;
      setCurrentPage(page - 1);
    }
  }, [router.query, router.asPath]);

  useEffect(() => {
    error && setMessage({ msg: (error as AxiosError).message, type: 'error' });
    console.log({ data });
  }, [error]);
  return (
    <div className={clsx(styles.Page)}>
      <div className={clsx('mt-40')}>
        {isValidating && !data && (
          <motion.div
            className={styles.LoadersWrapper}
            animate={{ opacity: [0, 1] }}
          >
            {' '}
            {Array(loadersAmount).fill(<HistoryResultBlockLoader />)}
          </motion.div>
        )}
        {error && data !== undefined && (
          <motion.div
            animate={{ opacity: [0, 1] }}
            className={clsx(styles.ErrorBlock, 'mb-20')}
          >
            <p>Error occured. Displaying cached data</p>
          </motion.div>
        )}
        {error && data === undefined && (
          <motion.div
            animate={{ opacity: [0, 1] }}
            className={clsx(styles.ErrorBlock, 'mb-20')}
          >
            <p>Error occured. Cannot access data</p>
          </motion.div>
        )}
        {!isValidating && !data && (
          <motion.h1 animate={{ opacity: [0, 1] }}>No history</motion.h1>
        )}

        {data?.history?.map((item) => (
          <motion.div key={item.id} animate={{ opacity: [0, 1] }}>
            <HistoryItem {...item} />
          </motion.div>
        ))}
      </div>
      {data !== undefined && (
        <Pagination
          pageCount={data?.totalPages || 1}
          currentPage={currentPage}
          onPageChange={changePage}
        />
      )}
    </div>
  );
};

(History as any).getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <WithActorModal>{page}</WithActorModal>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  console.log('SSR');
  const page = parseInt(queryParamToString(ctx.query.page || '1'));
  const data = await UserService.loadHistorySSR(
    page - 1,
    cookiesTostring(ctx.req.cookies)
  );
  return {
    props: {
      serverData: data,
    },
  };
};

export default History;
function useLoadersAmountProps() {
  throw new Error('Function not implemented.');
}
