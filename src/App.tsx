import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import './styles/main.scss';
import Loader from './components/Loader';
import { BrowserRouter, Routes } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Toast from '@/components/UI/Toast';
import { useActions } from '@/store/useActions';
import { useEffect } from 'react';

function App() {
  const { logIn, logOut, token, userId, userName, email, ready } = useAuth();
  const isAuth = !!token;
  const routes = useRoutes(!!token);
  const { setMessage } = useActions();

  useEffect(() => {
    setMessage({ msg: 'Test', type: 'success' });
  }, []);
  if (!ready) {
    return <Loader position="fixed" />;
  }
  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        userName,
        email,
        logIn,
        logOut,
        isAuth
      }}
    >
      <div id="app" className="app">
        <Toast />
        <BrowserRouter>
          {isAuth && <NavBar />}
          <Routes>{routes}</Routes>
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
