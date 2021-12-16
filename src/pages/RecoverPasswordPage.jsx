import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { AwesomeButton } from 'react-awesome-button';
import Toast from 'react-bootstrap/Toast';
import { useValidate } from '../hooks/validate.hook';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import 'react-awesome-button/dist/themes/theme-blue.css';
import Loader from '../components/Loader';

export default function RecoverEmail() {
  const { code } = useParams();
  const history = useHistory();
  const {
    loading, request, error, clearError,
  } = useHttp();
  const { show } = useMessage();
  const { validatePassword, passError } = useValidate();
  const [password, setPassword] = useState({ pass1: '', pass2: '' });
  const [matchError, setMatchError] = useState('');
  const [showA, setShowA] = useState(false);
  const [errorL, setError] = useState([]);
  const toggleShowA = () => {
    setShowA(!showA);
  };
  const getEmail = useCallback(async () => {
    try {
      const fetched = await request(`/api/auth/${code}`, 'GET', null, {});
    } catch (e) {
      setTimeout(() => history.push('/auth'), 3000);
    }
  }, [code, request]);
  const changeHandler = (event) => {
    setPassword({ ...password, [event.target.name]: event.target.value });
    validatePassword(event.target.value);
  };
  const recoverPassword = async () => {
    const data = await request('/api/auth/recoverpassword', 'POST', {
      password: password.pass2,
    });
    setShowA(show(data.message));
    setError(data.message);
    history.push('/auth');
  };
  const submitHandler = () => {
    if (password.pass1 !== '' && password.pass2 !== '' && passError === '' && matchError === '') {
      recoverPassword();
    } else { setShowA(show('Check form input')); setError('Check form input'); }
  };
  useEffect(() => {
    getEmail();
  }, [getEmail]);
  useEffect(() => {
    if (error) {
      setShowA(show(error));
      setError(error);
    }

    clearError();
  }, [error, show, clearError, setShowA]);
  useEffect(() => {
    if (
      password.pass1 !== ''
      && password.pass2 !== ''
      && password.pass1 !== password.pass2
    ) {
      setMatchError('Passwords should match');
    } else if (password.pass1 === password.pass2) {
      setMatchError('');
    }
  }, [password]);
  return (
    <div className="auth-container">
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
          <div className="card-header">Password recovery</div>
          <div className="card-body d-flex flex-column justify-content-center">
            <span>You will receive link to recover password on your email</span>

            <div className="input-group my-1">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Password
                </span>
              </div>
              <input
                type="password"
                name="pass1"
                className="form-control"
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  changeHandler(e);
                }}
                value={password.pass1}
              />
            </div>
            <div className="input-group my-1">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  Password
                </span>
              </div>
              <input
                type="password"
                name="pass2"
                className="form-control"
                placeholder="Password"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  changeHandler(e);
                }}
                value={password.pass2}
              />
            </div>
            <span className="error-message">{passError}</span>
            <span className="error-message">{matchError}</span>
            <div className="d-flex justify-content-center mt-5">
              <div className="button-wrapper">
                <AwesomeButton
                  type="primary"
                  size="large"
                  button-hover-pressure="3"
                  onPress={() => {
                    submitHandler();
                  }}
                >
                  Submit
                </AwesomeButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
