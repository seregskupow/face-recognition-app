import * as yup from 'yup';
import inputs from '../inputs.module.scss';
import styles from './registerForm.module.scss';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Panel from '@/components/UI/Panel';
import FormikLabel from '@/components/FormikComponents/FormikLabel';
import FormikSubmitButton from '@/components/FormikComponents/FormikSubmitButton';
import FormikTextField from '@/components/FormikComponents/FormikTextField';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import ProviderButtons from '@/components/Pages/AuthPage/Auth/ProvidersButtons';
import StyledLink from '@/components/UI/StyledLink';
import { authSelector } from '@/store/slices/auth.slice';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import AvatarPlaceholder from '@/images/recofun_placeholder.png';
import { checkIfImage } from '@/utils/imageExtention';
import { validationSchema } from '@/utils/validationSchemas';
import { useImagePicker } from '@/components/ImagePicker';
import Button from '@/components/UI/Button';
import { useActions } from '@/store/useActions';
// import ImagePicker from '@/components/ImagePicker';

export default function RegisterForm() {
  const router = useRouter();
  const [avatarUpl, setAvatar] = useState<string | null>(AvatarPlaceholder.src);
  const {
    ImagePicker,
    triggerInput,
    urlUpload,
    setShowAvatarPicker,
    resetImage,
    avatar,
  } = useImagePicker(AvatarPlaceholder.src, 384, 384);
  const { loading, loggedIn } = useSelector(authSelector);
  const { registerUser } = useActions();
  useEffect(() => {
    if (loggedIn && !loading) router.push('/');
  }, [loggedIn, loading, router]);
  // useEffect(() => {
  //   if (avatar !== AvatarPlaceholder.src && avatar !== null) {
  //     setShowAvatarPicker(true);
  //   }
  // }, [avatar]);

  return (
    <div className={styles.register__form}>
      <Panel>
        <ImagePicker getImage={(photo: string) => setAvatar(photo)} />
        <div className={styles.register__inner}>
          <h1 className={styles.register__title}>Register</h1>
          <Fragment>
            <div
              onClick={() => setShowAvatarPicker(true)}
              className={`${styles.avatar__wrapper} mb-10 btn__click`}
            >
              {avatar && (
                <Image
                  src={avatar as string}
                  width={300}
                  height={300}
                  layout='responsive'
                  alt='avatar'
                />
              )}
            </div>
            <p className='mb-10'>Click on image to configure</p>
          </Fragment>
          <div className={`${styles.img__controls} mb-20`}>
            <Button text='Choose image' event={triggerInput} />
            <Button text='Reset image' event={resetImage} />
          </div>
          <Formik
            validateOnChange
            initialValues={{
              name: '',
              email: '',
              password: '',
              passwordConfirmation: '',
            }}
            validationSchema={validationSchema.REGISTER}
            onSubmit={async (values) => {
              const { name, email, password } = values;
              registerUser({
                name,
                email,
                password,
                avatar: avatar as string,
              });
            }}
          >
            {() => (
              <Form autoComplete='off' className={inputs.auth__form}>
                <FormikLabel text={'Enter Credentials'} fontSize={2} />
                <FormikTextField type='text' name='name' />
                <FormikLabel text={'Enter email'} fontSize={2} />
                <FormikTextField type='email' name='email' />
                <FormikLabel text={'Enter password'} fontSize={2} />
                <FormikTextField type='password' name='password' />
                <FormikLabel text={'Repeat password'} fontSize={2} />
                <FormikTextField type='password' name='passwordConfirmation' />
                <FormikSubmitButton text={'Register'} isSubmitting={false} />
              </Form>
            )}
          </Formik>

          <ProviderButtons />
          <StyledLink href='/auth/login'>
            <h1>Login</h1>
          </StyledLink>
        </div>
      </Panel>
    </div>
  );
}
