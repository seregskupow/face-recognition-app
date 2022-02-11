import React, { useState, useEffect, useContext, SyntheticEvent } from 'react';

import styled from 'styled-components';
import Link from 'next/link';
// @ts-ignore
import { AwesomeButton } from 'react-awesome-button';
import { useHttp } from '@/hooks/http.hook';
import { useValidate } from '@/hooks/validate.hook';
import { useMessage } from '@/hooks/message.hook';
import { AuthContext } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import 'react-awesome-button/dist/themes/theme-blue.css';
import { setToken } from '@/api';
import { useActions } from '@/store/useActions';
import axios from 'axios';

export default function AuthPage() {
  const auth = useContext(AuthContext);
  const { setMessage } = useActions();
  const {
    validateName,
    validateEmail,
    validatePassword,
    nameError,
    passError,
    emailError,
  } = useValidate();
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [authType, setAuth] = useState(false);
  const [errorL, setError] = useState('');
  const onTypeClick = (event: SyntheticEvent) => {
    const el = event.currentTarget as HTMLInputElement;
    if (el.id === 'in') setAuth(false);
    else setAuth(true);
  };
  useEffect(() => {
    if (error) {
      setError(error);
    }

    clearError();
  }, [error, clearError]);

  const changeHandler = (event: SyntheticEvent) => {
    const el = event.currentTarget as HTMLInputElement;
    setForm({ ...form, [el.name]: el.value });
  };
  const loginHandler = async () => {
    if (passError === '' && emailError === '') {
      try {
        const { data } = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email: form.email,
            password: form.password,
          }
        );
        setMessage({ msg: data.message, type: 'success' });
        //Set global Authorization header for axios
        setToken(data.token);
        let test = await axios.get('/api/db/pagecount');
        console.log({ test });
        // @ts-ignore
        auth.logIn(data.token, data.userId, data.userName, data.email);
      } catch (e) {
        setMessage({ msg: (e as Error).message, type: 'error' });
      }
    } else {
      setMessage({ msg: 'Check form input', type: 'warning' });
    }
  };
  const registerHandler = async () => {
    if (passError === '' && emailError === '') {
      try {
        const data = await request('/api/auth/register', 'POST', {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setMessage({ msg: data.message, type: 'success' });
        if (data.success) {
          loginHandler();
        }
      } catch (e) {
        setMessage({ msg: (e as Error).message, type: 'error' });
      }
    } else {
      setMessage({ msg: 'Check form input', type: 'warning' });
    }
  };

  return (
    <div id='auth-container' className='auth-container'>
      {loading && <Loader position='fixed' />}
      <div className='auth-form'>
        <div className='card text-white bg-dark mb-3'>
          <p className='card-header'>Welcome to RecoFun</p>
          <div className='card-body d-flex flex-column justify-content-center'>
            <div className='' />
            <div className='d-flex justify-content-center my-2'>
              <span
                id='in'
                role='button'
                tabIndex={0}
                onKeyDown={(event) => onTypeClick(event)}
                onClick={(event) => onTypeClick(event)}
                className='signType'
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
                id='up'
                role='button'
                tabIndex={0}
                onKeyDown={(event) => onTypeClick(event)}
                onClick={(event) => onTypeClick(event)}
                className='signType'
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
            <Name show={authType} className='input-group my-1'>
              <div className='input-group-prepend'>
                <span className='input-group-text' id='basic-addon1'>
                  Name
                </span>
              </div>
              <input
                type='text'
                name='name'
                className='form-control'
                placeholder='Name'
                aria-label='Username'
                aria-describedby='basic-addon1'
                onChange={(e) => {
                  changeHandler(e);
                  validateName(e.target.value);
                }}
                value={form.name}
              />
            </Name>
            <span className='error-message'>{nameError}</span>
            <div className='input-group my-1'>
              <div className='input-group-prepend'>
                <span className='input-group-text' id='basic-addon1'>
                  Email
                </span>
              </div>
              <input
                type='text'
                name='email'
                className='form-control'
                placeholder='username@email.com'
                aria-label='username@email.com'
                aria-describedby='basic-addon1'
                onChange={(e) => {
                  changeHandler(e);
                  validateEmail(e.target.value);
                }}
                value={form.email}
              />
            </div>
            <span className='error-message'>{emailError}</span>
            <div className='input-group my-1'>
              <div className='input-group-prepend'>
                <span className='input-group-text' id='basic-addon1'>
                  Password
                </span>
              </div>
              <input
                type='password'
                name='password'
                className='form-control'
                placeholder='Password'
                aria-label='Username'
                aria-describedby='basic-addon1'
                onChange={(e) => {
                  changeHandler(e);
                  validatePassword(e.target.value);
                }}
                value={form.password}
              />
            </div>
            <span className='error-message'>{passError}</span>
            <Link href='/recoveremail'>
              <a className='recover-pass-prompt'>Forgot password?</a>
            </Link>
            <div className='d-flex justify-content-center mt-5'>
              <div
                className='button-wrapper'
                style={{ display: !authType ? 'block' : 'none' }}
              >
                <AwesomeButton
                  type='primary'
                  size='large'
                  button-hover-pressure='3'
                  onPress={() => {
                    loginHandler();
                  }}
                >
                  Log in
                </AwesomeButton>
              </div>
              <div
                className='button-wrapper'
                style={{ display: authType ? 'block' : 'none' }}
              >
                <AwesomeButton
                  type='primary'
                  size='large'
                  button-hover-pressure='3'
                  onPress={() => {
                    registerHandler();
                  }}
                >
                  Sign up
                </AwesomeButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const Name = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex!important' : 'none!important')};
`;
