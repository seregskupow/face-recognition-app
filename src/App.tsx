import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import './styles/main.scss';
import Loader from './components/Loader';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import Toast from '@/components/UI/Toast';
import { useActions } from '@/store/useActions';
import { useEffect } from 'react';
import ActorInfoModal from './components/ActorInfoModal';
import ActorPage from './pages/ActorPage';
import AuthPage from './pages/AuthPage';
import FaceMatch from './pages/FaceMatch';
import History from './pages/History';
import FaceMatchNew from './pages/FaceMatchNew';
import HistoryNew from './pages/HistoryNew';
import Home from './pages/Home';
import RecoverEmail from './pages/RecoverEmail';
import RecoverPasswordPage from './pages/RecoverPasswordPage';

function App() {
  const { logIn, logOut, token, userId, userName, email, ready } = useAuth();
  let location = useLocation();

  let state = location.state as { backgroundLocation?: Location };
  const isAuth = !!token;
  //const routes = useRoutes(!!token, state?.backgroundLocation);
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
        {isAuth && <NavBar />}
        <Routes location={state?.backgroundLocation || location}>
          {isAuth ? (
            <>
              <Route path="/" element={<Home isAuth />} />
              <Route path="/match" element={<FaceMatch />} />
              <Route path="/match_new" element={<FaceMatchNew />} />
              <Route path="/history" element={<History />} />
              <Route path="/history_new" element={<HistoryNew />} />
              <Route path="/actorinfo/:id" element={<ActorPage />} />
            </>
          ) : (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/recoveremail" element={<RecoverEmail />} />
              <Route
                path="/recoverpassword/:code"
                element={<RecoverPasswordPage />}
              />
              <Route path="/" element={<Home isAuth={false} />} />
            </>
          )}
        </Routes>
        {isAuth && state?.backgroundLocation && (
          <Routes>
            <Route path="/actorinfo/:id" element={<ActorInfoModal />} />
          </Routes>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
