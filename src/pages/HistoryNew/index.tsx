import { FC, ReactElement, useState } from 'react';

import { AxiosError } from 'axios';
import useSWR from 'swr';
import clsx from 'clsx';

import { UserService } from '@/api';

import { LoadHistoryResponse } from '@/types/index';

import { useActions } from '@/store/useActions';

import HistoryItem from '@/components/HistoryPage/HistoryItem';

import styles from './history.module.scss';

const History: FC = () => {
  const { setMessage } = useActions();
  const [page, setPage] = useState(1);
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
            <HistoryItem {...item} />
          ))}
        </div>
      );
    }
    return (
      <>
        <h1>No history</h1>
      </>
    );
  };
  return <div className={clsx(styles.Page)}>{renderHistory()}</div>;
};

export default History;
