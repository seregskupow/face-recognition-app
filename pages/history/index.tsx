import { FC, ReactElement, useEffect, useState } from 'react';

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
interface HistoryProps {
  serverData: UserHistoryResponseDto;
  fallback: { [key: string]: UserHistoryResponseDto };
}

const History: FC<HistoryProps> = ({ serverData, fallback }) => {
  const router = useRouter();
  const [serverQuery] = useState(router.query);
  const { setMessage } = useActions();
  const [currentPage, setCurrentPage] = useState(serverData.currentPage);
  const { data, isValidating, error } = useSWR(
    ['userHistory', currentPage],
    (key, page) => UserService.loadHistory(page),
    {
      revalidateOnFocus: false,
      fallback,
    }
  );
  console.log({ data });
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
  };
  useEffect(() => {
    changePage(serverData.currentPage);
  }, []);
  // useEffect(() => {
  //   console.log({ data });
  //   if (!isValidating && router.query.page) {
  //     data?.currentPage !== undefined && changePage(data.currentPage);
  //   }
  // }, [data?.currentPage, isValidating]);
  //Prevent SWR fetch when ActorModal opens and query.page becomes undefined
  // useEffect(() => {
  //   const { query, pathname, asPath } = router;
  //   const thisPagePathname = pathname;
  //   const currentPathName = asPath;

  //   if (!currentPathName.includes(thisPagePathname)) return;
  //   const page = parseInt(queryParamToString(query.page || '1'), 10);
  //   console.log({ QUERR: query });
  //   setCurrentPage(page - 1);
  //   console.log({ VALIDATING: isValidating });
  // }, [router.query, router.asPath]);

  const renderHistory = (): ReactElement => {
    if (error) {
      setMessage({ msg: (error as AxiosError).message, type: 'error' });
      return <>Error occured</>;
    }
    if (isValidating) {
      return (
        <>
          <motion.h1 animate={{ opacity: [0, 1] }}>Loading...</motion.h1>
        </>
      );
    } else if (!data?.history?.length) {
      return (
        <>
          <motion.h1 animate={{ opacity: [0, 1] }}>No history</motion.h1>
        </>
      );
    }
    return (
      <div className={clsx('mt-40')}>
        {data?.history?.map((item) => (
          <motion.div key={item.id} animate={{ opacity: [0, 1] }}>
            <HistoryItem {...item} />
          </motion.div>
        ))}
      </div>
    );
  };
  return (
    <div className={clsx(styles.Page)}>
      <div className={clsx('mt-40')}>
        {data?.history?.map((item) => (
          <motion.div key={item.id} animate={{ opacity: [0, 1] }}>
            <HistoryItem {...item} />
          </motion.div>
        ))}
      </div>
      <Pagination
        pageCount={data?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={changePage}
      />
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
  const page = parseInt(queryParamToString(ctx.query.page || '1'));
  const data = await UserService.loadHistorySSR(
    page - 1,
    cookiesTostring(ctx.req.cookies)
  );
  return {
    props: {
      serverData: data,
      fallback: {
        [unstable_serialize(['userHistory', data.currentPage])]: data,
      },
    },
  };
};

export default History;
