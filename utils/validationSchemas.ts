import * as yup from 'yup';

export const validationSchema = {
  LOGIN: yup.object({
    email: yup
      .string()
      .email('Email is invalid')
      .min(3, 'Min length should be 3 characters')
      .max(254, 'Max length should be 254 characters')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Min length should be 8 characters')
      .max(20, 'Max length should be 20 characters')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        'Password is invalid'
      )
      .required('Password is required'),
  }),
  REGISTER: yup.object({
    name: yup
      .string()
      .min(6, 'Min length should be 6')
      .max(20, 'Max length should be 15')
      .required(),
    email: yup
      .string()
      .email('Email is invalid')
      .min(3, 'Min length should be 3 characters')
      .max(254, 'Max length should be 254 characters')
      .required('Email is required'),
    password: yup
      .string()
      .min(8, 'Min length should be 8')
      .max(15, 'Max length should be 15')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        'Password is invalid'
      )
      .required('Password is required'),
    passwordConfirmation: yup
      .string()
      .min(8, 'Min length should be 8')
      .max(15, 'Min length should be 15')
      .oneOf([yup.ref('password'), null], 'Password do not match')
      .required('Password confirmation is required'),
  }),
  PROFILE: yup.object({
    name: yup
      .string()
      .min(4, 'Min length should be 4')
      .max(20, 'Max length should be 15')
      .required(),
    email: yup
      .string()
      .email('Email is invalid')
      .min(3, 'Min length should be 3 characters')
      .max(254, 'Max length should be 254 characters')
      .required('Email is required'),
  }),
  CHANGE_PASSWORD: yup.object({
    oldPassword: yup
      .string()
      .min(8, 'Min length should be 8')
      .max(15, 'Max length should be 15')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        'Password is invalid'
      )
      .required('Password is required'),
    password: yup
      .string()
      .min(8, 'Min length should be 8')
      .max(15, 'Max length should be 15')
      .matches(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
        'Password is invalid'
      )
      .notOneOf(
        [yup.ref('password'), null],
        'New password must differ from current'
      )
      .required('Password is required'),
    passwordConfirmation: yup
      .string()
      .min(8, 'Min length should be 8')
      .max(15, 'Min length should be 15')
      .oneOf([yup.ref('password'), null], 'Password do not match')
      .required('Password confirmation is required'),
  }),
};
