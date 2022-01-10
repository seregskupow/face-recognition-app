import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import FaceMatch from './pages/FaceMatch';
import AuthPage from './pages/AuthPage';
import NavBar from './components/NavBar';
import ActorPage from './pages/ActorPage';
import RecoverEmail from './pages/RecoverEmail';
import RecoverPasswordPage from './pages/RecoverPasswordPage';
import FaceMatchNew from './pages/FaceMatchNew';

export const useRoutes = (isLoggedIn: boolean) => {
  if (isLoggedIn) {
    return (
      <>
        <Route path="/" element={<Home isAuth />} />
        <Route path="/match" element={<FaceMatch />} />
        <Route path="/match_new" element={<FaceMatchNew />} />
        <Route path="/history" element={<History />} />
        <Route path="/actorinfo/:id" element={<ActorPage />} />
      </>
    );
  }
  return (
    <>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/recoveremail" element={<RecoverEmail />} />
      <Route path="/recoverpassword/:code" element={<RecoverPasswordPage />} />
      <Route path="/" element={<Home isAuth={false} />} />
    </>
  );
};
