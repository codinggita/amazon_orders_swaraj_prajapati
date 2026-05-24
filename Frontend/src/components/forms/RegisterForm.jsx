import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Full name is required'),
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[@$!%*?&]/, 'Must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
});

export default function RegisterForm() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const loading   = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    return () => { dispatch(clearError()); };
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const result = await dispatch(registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      }));
      if (registerUser.fulfilled.match(result)) {
        toast.success('Registration successful! Please sign in.');
        navigate('/login');
      } else {
        toast.error(result.payload || 'Registration failed');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
      {authError && (
        <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2">
          <span className="font-body-sm text-[12px] text-red-400">{authError}</span>
        </div>
      )}

      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            name="name"
            type="text"
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 w-full ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
          />
        </div>
        {formik.touched.name && formik.errors.name && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1">⚠ {formik.errors.name}</p>
        )}
      </div>

      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 w-full ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1">⚠ {formik.errors.email}</p>
        )}
      </div>

      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 pr-10 w-full ${formik.touched.password && formik.errors.password ? 'border-red-500' : ''}`}
          />
          <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-700/60 hover:text-red-500">
            {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1">⚠ {formik.errors.password}</p>
        )}
      </div>

      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-1.5">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 w-full ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : ''}`}
          />
        </div>
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1">⚠ {formik.errors.confirmPassword}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="terms"
          checked={formik.values.terms}
          onChange={formik.handleChange}
          className="w-3.5 h-3.5 rounded border-red-800 bg-red-950 text-red-600 focus:ring-red-600 focus:ring-1"
        />
        <span className="font-body-sm text-[12px] text-red-300/50">I accept the terms and conditions</span>
      </div>
      {formik.touched.terms && formik.errors.terms && (
        <p className="font-body-xs text-[11px] text-red-500">⚠ {formik.errors.terms}</p>
      )}

      <button
        type="submit"
        disabled={loading || !formik.isValid}
        className="w-full font-btn text-[14px] bg-red-600 hover:bg-red-700 disabled:bg-red-900/40 disabled:text-red-700/50 text-white h-11 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Create Account'}
      </button>
    </form>
  );
}
