import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  remember: Yup.boolean(),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long')
    .required('Full name is required'),
  email: Yup.string()
    .trim()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Include at least one uppercase letter')
    .matches(/[0-9]/, 'Include at least one number')
    .required('Password is required'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms to continue')
    .required('You must accept the terms'),
});
