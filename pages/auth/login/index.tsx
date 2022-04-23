import AuthLayout, { variants } from '@/components/Layouts/AuthLayout';
import LoginForm from '@/components/Pages/AuthPage/Auth/LoginForm';
import { AuthService } from 'api/auth.service';
import { motion } from 'framer-motion';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement } from 'react';

const Login = () => {
  return (
    <motion.div
      key='register'
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      <LoginForm />
    </motion.div>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
