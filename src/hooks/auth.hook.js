import { useState, useCallback, useEffect } from 'react';
import { useHttp } from './http.hook';
import { setToken as setAxiosToken, removeToken } from '@/api';
const userData = 'User';
export const useAuth = () => {
  const { request } = useHttp();
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setId] = useState(null);
  const [email, setEmail] = useState(null);
  const [userName, setName] = useState(null);

  const logIn = useCallback((jwtToken, id, name, userEmail) => {
    setToken(jwtToken);
    setId(id);
    setName(name);
    setEmail(userEmail);
    localStorage.setItem(
      userData,
      JSON.stringify({
        token: jwtToken,
        userId: id,
        userName: name,
        email: userEmail
      })
    );
    // history.push(location);
  }, []);
  const logOut = useCallback(() => {
    setToken(null);
    setId(null);
    setName(null);
    setEmail(null);
    removeToken();
    localStorage.removeItem(userData);
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(userData));
    if (data && data.token) {
      logIn(data.token, data.userId, data.userName, data.email);
      setAxiosToken(data.token);
    }
    setReady(true);
  }, [logIn]);
  return {
    logIn,
    logOut,
    token,
    userId,
    userName,
    email,
    ready
  };
};
