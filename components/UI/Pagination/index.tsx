import styles from './pagination.module.scss';
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import queryParamToString from '@/utils/queryParamToString';

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  pageCount,
  currentPage,
  onPageChange,
}) => {
  return (
    <div className={styles.PaginationContainer}>
      <ReactPaginate
        marginPagesDisplayed={3}
        forcePage={currentPage}
        previousLabel={<MdNavigateBefore />}
        nextLabel={<MdNavigateNext />}
        pageRangeDisplayed={10}
        pageCount={pageCount}
        onPageChange={({ selected }) => onPageChange(selected)}
        containerClassName={styles.Pagination}
        pageClassName={styles.NumberLink}
        previousClassName={styles.LinkPrev}
        nextClassName={styles.LinkNext}
        disabledClassName={styles.Link__Disabled}
        activeClassName={styles.Link__Active}
        breakClassName={styles.Break}
        breakLabel={<BiDotsHorizontalRounded />}
        pageLinkClassName='btn__click'
        previousLinkClassName='btn__click'
        nextLinkClassName='btn__click'
      />
    </div>
  );
};

export default Pagination;
