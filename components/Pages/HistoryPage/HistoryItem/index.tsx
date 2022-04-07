import { FC } from 'react';

import clsx from 'clsx';

import { Historyitem } from '@/types/index';
import { formatDate } from '@/utils/formatDate';
import HistoryResultBlock from '@/components/Pages/HistoryPage/HistoryResultBlock';

import styles from './historyItem.module.scss';

interface HistoryItemProps extends Historyitem {}

const HistoryItem: FC<HistoryItemProps> = ({ date, results }) => {
  return (
    <div className={clsx('mb-20')}>
      <h1 className={clsx(styles.Date, 'mb-20')}>{formatDate(date)}</h1>
      <div className={styles.ResultsContainer}>
        {results.map((item) => (
          <div key={item.usedImage} className={styles.ResultGridItem}>
            <HistoryResultBlock {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryItem;
