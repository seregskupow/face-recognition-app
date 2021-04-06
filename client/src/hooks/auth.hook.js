import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useHttp } from './http.hook';

const userData = 'User';
export const useAuth = () => {
  const history = useHistory();
  const { request } = useHttp();
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setId] = useState(null);
  const [userName, setName] = useState(null);

  const logIn = useCallback((jwtToken, id, name, location) => {
    setToken(jwtToken);
    setId(id);
    setName(name);
    localStorage.setItem(
      userData,
      JSON.stringify({ token: jwtToken, userId: id, userName: name })
    );
    history.push(location);
  }, []);
  const logOut = useCallback(() => {
    setToken(null);
    setId(null);
    setName(null);
    localStorage.removeItem(userData);
    sessionStorage.clear();
  }, []);

  const checkCookies = async () => {
    const res = await request('/api/auth/checkauth');
    setName(res.name);
    console.log(res);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(userData));
    checkCookies();
    if (data && data.token) {
      logIn(data.token, data.userId, data.userName, history.location);
    }
    setReady(true);
  }, [logIn]);
  return {
    logIn,
    logOut,
    token,
    userId,
    userName,
    ready,
  };
};
