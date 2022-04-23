import { motion } from 'framer-motion';
import AuthLayout, { variants } from '@/components/Layouts/AuthLayout';
import RegisterForm from '@/components/Pages/AuthPage/Auth/RegisterForm';
import styles from './registerPage.module.scss';
// import { wrapper } from '@/store/index';
// import { ensureAuth } from '@/utils/ensureAuth';
// import { GetServerSideProps } from 'next';
import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { AuthService } from '@/api';

function Register() {
  return (
    <motion.div
      key='register'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
      className={styles.register__container}
    >
      <RegisterForm />
    </motion.div>
  );
}

Register.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};


export default Register;

