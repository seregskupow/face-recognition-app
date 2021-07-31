import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Toast from 'react-bootstrap/Toast';
import {
  AwesomeButton,
} from 'react-awesome-button';
import { useHttp } from '../hooks/http.hook';
import { useValidate } from '../hooks/validate.hook';
import { useMessage } from '../hooks/message.hook';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import 'react-awesome-button/dist/themes/theme-blue.css';

export default function AuthPage() {
  const auth = useContext(AuthContext);
  const {
    validateName, validateEmail, validatePassword, nameError, passError, emailError,
  } = useValidate();
  const {
    loading, request, error, clearError,
  } = useHttp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [authType, setAuth] = useState(false);
  const [errorL, setError] = useState([]);
  const onTypeClick = (e) => {
    if (e.target.id === 'in') setAuth(false);
    else setAuth(true);
  };
  const [showA, setShowA] = useState(false);
  const { show } = useMessage();
  const toggleShowA = () => {
    setShowA(!showA);
  };

  useEffect(() => {
    if (error) {
      setShowA(show(error));
      setError(error);
    }

    clearError();
  }, [error, show, clearError, setShowA]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const loginHandler = async () => {
    if (passError === '' && emailError === '') {
      try {
        const data = await request(
          `${process.env.REACT_APP_PORT}/api/auth/login`,
          'POST',
          { email: form.email, password: form.password },
        );
        setShowA(show(data.message));
        setError(data.message);
        auth.logIn(data.token, data.userId, data.userName, data.email);
      } catch (e) {
        setShowA(show(e.message));
        setError(e.message);
      }
    } else { setShowA(show('Check form input')); setError('Check form input'); }
  };
  const registerHandler = async () => {
    if (passError === '' && emailError === '') {
      try {
        const data = await request(
          '/api/auth/register',
          'POST',
          {
            name: form.name,
            email: form.email,
            password: form.password,
          },
        );
        setShowA(show(data.message));
        setError(data.message);
        if (data.success) {
          loginHandler();
        }
      } catch (e) {
        setShowA(show(e.message));
        setError(e.message);
      }
    } else { setShowA(show('Check form input')); setError('Check form input'); }
  };

  return (
    <div id="auth-container" className="auth-container">
      {loading && <Loader position="fixed" />}
      <Toast
        show={showA}
        onClose={toggleShowA}
        delay={2000}
        autohide
        style={{
          position: 'absolute',
          top: 0,
          right: 20,
        }}
      >
        <Toast.Body>{errorL}</Toast.Body>
      </Toast>

      <div className="auth-form">
        <div className="card text-white bg-dark mb-3">
          <p className="card-header">Welcome to RecoFun</p>
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="" />
            <div className="d-flex justify-content-center my-2">
              <span
                id="in"
                role="button"
                tabIndex="0"
                onKeyDown={(event) => onTypeClick(event)}
                onClick={(event) => onTypeClick(event)}
                className="signType"
                style={{
                  background: `${
                    !authType
                      ? 'linear-gradient(315deg, #2876f9 30%, #6d17cb 74%)'
                      : 'transparent'
                  }`,
                }}
              >
                Log in
              </span>
              <span
                id="up"
                role="button"
                tabIndex="0"
                onKeyDown={(event) => onTypeClick(event)}
                onClick={(event) => onTypeClick(event)}
                className="signType"
                style={{
                  background: `${
                    authType
                      ? 'linear-gradient(315deg, #2876f9 30%, #6d17cb 74%)'
                      : 'transparent'
                  }`,
                }}
              >
                Sign up
              </span>
            </div>
            <Name show={authType} className="input-group my-1">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Name
                </span>
              </div>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => { changeHandler(e); validateName(e.target.value); }}
                value={form.name}
              />

            </Name>
            <span className="error-message">{nameError}</span>
            <div className="input-group my-1">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Email
                </span>
              </div>
              <input
                type="text"
                name="email"
                className="form-control"
                placeholder="username@email.com"
                aria-label="username@email.com"
                aria-describedby="basic-addon1"
                onChange={(e) => { changeHandler(e); validateEmail(e.target.value); }}
                value={form.email}
              />
            </div>
            <span className="error-message">{emailError}</span>
            <div className="input-group my-1">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Password
                </span>
              </div>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => { changeHandler(e); validatePassword(e.target.value); }}
                value={form.password}
              />
            </div>
            <span className="error-message">{passError}</span>
            <NavLink
              exact
              to="/recoveremail"
              className="recover-pass-prompt"
            >
              Forgot password?
            </NavLink>
            <div className="d-flex justify-content-center mt-5">
              <div className="button-wrapper" style={{ display: !authType ? 'block' : 'none' }}>
                <AwesomeButton type="primary" size="large" button-hover-pressure="3" onPress={() => { loginHandler(); }}>Log in</AwesomeButton>
              </div>
              <div className="button-wrapper" style={{ display: authType ? 'block' : 'none' }}>
                <AwesomeButton type="primary" size="large" button-hover-pressure="3" onPress={() => { registerHandler(); }}>Sign up</AwesomeButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const Name = styled.div`
  display: ${(props) => (props.show ? 'flex!important' : 'none!important')};
`;
