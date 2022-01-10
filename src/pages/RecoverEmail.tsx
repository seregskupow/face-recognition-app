import React, { useState, useEffect } from 'react';
//@ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import Toast from 'react-bootstrap/Toast';
import { useValidate } from '../hooks/validate.hook';
import { useHttp } from '../hooks/http.hook';
import { useMessage } from '../hooks/message.hook';
import Loader from '../components/Loader';
import 'react-awesome-button/dist/themes/theme-blue.css';

export default function RecoverEmail() {
  const { validateEmail, emailError } = useValidate();
  const { loading, request, error, clearError } = useHttp();
  const { show } = useMessage();
  const [email, setEmail] = useState('');
  const [showA, setShowA] = useState(false);
  const [errorL, setError] = useState("");
  const toggleShowA = () => {
    setShowA(!showA);
  };

  const checkEmail = async () => {
    const data = await request('/api/auth/checkemail', 'POST', {
      email
    });
    setShowA(show(data.message) as boolean);
    setError(data.message);
  };
  const submitHandler = () => {
    if (email !== '' && emailError === '') {
      checkEmail();
    } else {
      setShowA(show('Check form input') as boolean);
      setError('Check form input');
    }
  };

  useEffect(() => {
    if (error) {
      setShowA(show(error) as boolean);
      setError(error);
    }

    clearError();
  }, [error, show, clearError, setShowA]);
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
          right: 20
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                value={email}
              />
            </div>
            <span className="error-message">{emailError}</span>
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
