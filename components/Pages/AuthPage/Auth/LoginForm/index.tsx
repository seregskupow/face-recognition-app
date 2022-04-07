import styles from './loginForm.module.scss';
import React, { useEffect, useState } from 'react';
import inputStyes from '../inputs.module.scss';
import { Formik, Form } from 'formik';
import ProviderButtons from '../ProvidersButtons';
import FormikTextField from '@/components/FormikComponents/FormikTextField';
import FormikSubmitButton from '@/components/FormikComponents/FormikSubmitButton';
import FormikLabel from '@/components/FormikComponents/FormikLabel';
import { authSelector } from '@/store/slices/auth.slice';
import { validationSchema } from '@/utils/validationSchemas';
import Panel from '@/components/UI/Panel';
import StyledLink from '@/components/UI/StyledLink';
import { useSelector } from 'react-redux';
import { useActions } from '@/store/useActions';
import { useRouter } from 'next/router';

export default function LoginForm() {
  const { loading, loggedIn } = useSelector(authSelector);
  const { loginUser } = useActions();
  const router = useRouter();
  useEffect(() => {
    if (loggedIn && !loading) router.push('/');
  }, [loggedIn, loading, router]);

  return (
    <div className={styles.login__form}>
      <Panel padding={0}>
        <div className={styles.login__form__inner}>
          <div className={styles.login__form__left}>
            <div>
              <h2>{'RecoFun'}</h2>
            </div>
          </div>
          <div className={styles.login__form__right}>
            <h1 className={styles.login__title}>Login</h1>
            <Formik
              initialValues={{
                email: 'sergskypow@gmail.com',
                password: '12345678Ss',
              }}
              validationSchema={validationSchema.LOGIN}
              onSubmit={async (values) => {
                loginUser(values);
              }}
            >
              {() => (
                <Form autoComplete='off' className={inputStyes.auth__form}>
                  <FormikLabel text={'Enter email'} fontSize={2} />
                  <FormikTextField type='email' name='email' />
                  <FormikLabel text={'enter password'} fontSize={2} />
                  <FormikTextField type='password' name='password' />
                  <FormikSubmitButton text={'Login'} isSubmitting={false} />
                </Form>
              )}
            </Formik>
            <ProviderButtons />
            <FormikLabel text={'No account?'} fontSize={2} />
            {/* <MyLink href='/auth/register' color='blue' text={'Register'} />
        <LanguageSwitcher /> */}
            <StyledLink href='/auth/register'>
              <h1>Register</h1>
            </StyledLink>
          </div>
        </div>
      </Panel>
    </div>
  );
}
