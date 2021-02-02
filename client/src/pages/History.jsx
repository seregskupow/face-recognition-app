import React, {
  useState, useEffect, useCallback, useContext,
} from 'react';
import { NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import {
  AwesomeButton,
} from 'react-awesome-button';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import ActorWrapper from '../components/ActorWrapper';
import qs from '../utils/parseQuery';
import 'react-awesome-button/dist/themes/theme-blue.css';

const History = ({ history, isMob }) => {
  const { token } = useContext(AuthContext);
  const { request } = useHttp();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageCount, setPageCount] = useState(0);
  const pushHistory = (toPage) => {
    history.push(`/history?page=${+toPage}`);
    setData([]);
    setPage(toPage);
  };
  const fetchHistory = useCallback(async () => {
    try {
      const userHistory = await request(
        `/api/db/loadhistory?page=${page}`,
        'GET',
        null,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      );
      setData(() => [...userHistory.history]);
      setLoading(false);
    } catch (e) {}
  }, [token, request, page]);
  const getPageCount = useCallback(async () => {
    try {
      setLoading(true);
      const { count } = await request(
        '/api/db/pagecount',
        'GET',
        null,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      );
      setPageCount(parseInt(count, 10) / 10);
    } catch (e) {}
  });
  useEffect(() => {
    setPage(+qs('page'));
    getPageCount();
  }, [page]);
  useEffect(() => {
    fetchHistory();
  }, [page]);
  if (loading) {
    return <Loader position="fixed" />;
  } if (!loading && data.length === 0) {
    return (
      <div className="no-history">
        <div className="no-history-wrapper">
          <NavLink exact to="/match" className="menu-link">
            <AwesomeButton
              type="primary"
              size="large"
              button-hover-pressure="3"
            >
              Try it out
            </AwesomeButton>
          </NavLink>
        </div>
      </div>
    );
  }
  return (
    <section id="actor-info-section" className="">
      <div className="actor-info-section-wrapper">
        {data.reverse().map((item) => (
          <div
            key={Math.random() * (9999 - 1000) * 1000}
            className="row actors-info d-flex flex-column"
          >
            <ActorWrapper
              data={item.actors}
              date={item.date}
              image={item.usedImg}
            />
          </div>
        ))}
        <div className="pagination-wrapper">
          <ReactPaginate
            className="pagination"
            previousLabel="<"
            nextLabel=">"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={pageCount}
            marginPagesDisplayed={isMob === true ? 1 : 5}
            pageRangeDisplayed={isMob === true ? 1 : 5}
            onPageChange={({ selected }) => pushHistory(selected)}
            containerClassName="pagination"
            pageClassName="page-item"
            activeClassName="page-link-active link-page"
            pageLinkClassName="link-page"
            previousLinkClassName="link-page"
            nextLinkClassName="link-page"
            previousClassName="page-item"
            nextClassName="page-item"
            disabledClassName="page-item disabled"
            forcePage={page}
          />
        </div>
      </div>
    </section>
  );
};
History.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  isMob: PropTypes.bool.isRequired,
};
export default History;
