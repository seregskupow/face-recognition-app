import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import FaceMatch from './pages/FaceMatch';
import AuthPage from './pages/AuthPage';
import NavBar from './components/NavBar';
import ActorPage from './pages/ActorPage';
import RecoverEmail from './pages/RecoverEmail';
import RecoverPasswordPage from './pages/RecoverPasswordPage';

export const useRoutes = (isLoggedIn) => {
  if (isLoggedIn) {
    return (
      <>
        <NavBar />
        <Switch>
          <Route path="/" exact render={(props) => <Home {...props} isAuth />} />
          <Route path="/match" exact component={FaceMatch} />
          <Route path="/history" render={(props) => <History {...props} />} />
          <Route path="/actorinfo/:id" component={ActorPage} />
          <Redirect to="/" />
        </Switch>
      </>

    );
  }
  return (
    <Switch>
      <Route path="/auth" exact component={AuthPage} />
      <Route path="/recoveremail" exact component={RecoverEmail} />
      <Route path="/recoverpassword/:code" exact component={RecoverPasswordPage} />
      <Route path="/" render={(props) => <Home {...props} isAuth={false} />} />
      <Redirect to="/" />
    </Switch>
  );
};
