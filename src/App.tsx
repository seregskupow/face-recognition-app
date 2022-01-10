import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import './styles/main.scss';
import Loader from './components/Loader';
import { BrowserRouter, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { Provider } from 'react-redux';
import { store } from '@/store/index';

function App() {
  const { logIn, logOut, token, userId, userName, email, ready } = useAuth();
  const isAuth = !!token;
  const routes = useRoutes(!!token);
  if (!ready) {
    return <Loader position="fixed" />;
  }
  return (
    <Provider store={store}>
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
          <BrowserRouter>
            {isAuth && <NavBar />}
            <Routes>{routes}</Routes>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;
