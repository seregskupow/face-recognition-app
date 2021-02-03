import React from 'react';
import { useRoutes } from './routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import './scss/main.scss';
import Loader from './components/Loader';

function App() {
  const {
    logIn, logOut, token, userId, userName, ready,
  } = useAuth();
  const isAuth = !!token;
  const routes = useRoutes(!!token);
  if (!ready) {
    return <Loader position="fixed" />;
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userName,
        logIn,
        logOut,
        isAuth,
      }}
    >
      <div id="app" className="app">{routes}</div>
    </AuthContext.Provider>
  );
}

export default App;
