import { FC, ReactElement, useState } from 'react';

import { AxiosError } from 'axios';
import useSWR from 'swr';
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

const History = () => {
  let router = useRouter();
  const { setMessage } = useActions();
  const [page, setPage] = useState(0);
  const { data, isValidating, error } = useSWR(
    ['userHistory', page],
    (key, page) => UserService.loadHistory(page),
    { revalidateOnFocus: false }
  );
  const increasePage = () => {
    setPage((page) => page + 1);
  };
  const page3 = () => {
    setPage(3);
  };

  const renderHistory = (): ReactElement => {
    if (error) {
      setMessage({ msg: (error as AxiosError).message, type: 'error' });
      return <>Error occured</>;
    }
    if (!isValidating && data?.data.length) {
      return (
        <div className={clsx('mt-40')}>
          {data?.data?.map((item) => (
            <motion.div key={item.id} animate={{ opacity: [0, 1] }}>
              <HistoryItem {...item} />
            </motion.div>
          ))}
        </div>
      );
    }
    return (
      <>
        <motion.h1 animate={{ opacity: [0, 1] }}>No history</motion.h1>
      </>
    );
  };
  return <div className={clsx(styles.Page)}>{renderHistory()}</div>;
};

History.getLayout = (page: ReactElement) => {
  return (
    <MainLayout>
      <WithActorModal>{page}</WithActorModal>
    </MainLayout>
  );
};

export default History;
