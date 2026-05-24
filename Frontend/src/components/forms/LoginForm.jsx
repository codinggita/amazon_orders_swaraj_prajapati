import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

export default function LoginForm() {
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
      email:      '',
      password:   '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const result = await dispatch(loginUser({
        email:    values.email,
        password: values.password,
      }));
      if (loginUser.fulfilled.match(result)) {
        toast.success(`Welcome back, ${result.payload.user?.name || 'User'}! 🎉`);
        navigate('/dashboard');
      } else {
        toast.error(result.payload || 'Login failed');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} noValidate className="space-y-4">
      
      {/* Auth error banner */}
      {authError && (
        <div className="p-3 bg-red-950/60 border border-red-800/60
                        rounded-xl flex items-center gap-2">
          <span className="font-body-sm text-[12px] text-red-400">{authError}</span>
        </div>
      )}

      {/* Email */}
      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em]
                           text-red-400/50 uppercase block mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2
                           w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@orderpulse.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 w-full
              ${formik.touched.email && formik.errors.email
                ? 'border-red-500 focus:border-red-500' : ''}`}
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1 flex items-center gap-1">
            ⚠ {formik.errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="font-table-header text-[9px] tracking-[0.18em]
                           text-red-400/50 uppercase block mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2
                           w-4 h-4 text-red-700/60 pointer-events-none"/>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`input-dark pl-10 pr-10 w-full
              ${formik.touched.password && formik.errors.password
                ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2
                       text-red-700/60 hover:text-red-500 transition-colors">
            {showPassword
              ? <EyeOff className="w-4 h-4"/>
              : <Eye    className="w-4 h-4"/>}
          </button>
        </div>
        {formik.touched.password && formik.errors.password && (
          <p className="font-body-xs text-[11px] text-red-500 mt-1">
            ⚠ {formik.errors.password}
          </p>
        )}
      </div>

      {/* Remember me + Forgot */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            className="w-3.5 h-3.5 rounded border-red-800 bg-red-950
                       text-red-600 focus:ring-red-600 focus:ring-1"/>
          <span className="font-body-sm text-[12px] text-red-300/50">
            Remember me
          </span>
        </label>
        <a href="/forgot-password"
           className="font-body-sm text-[12px] text-red-400/70 hover:text-red-400">
          Forgot password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !formik.isValid}
        className="w-full font-btn text-[14px] bg-red-600 hover:bg-red-700
                   disabled:bg-red-900/40 disabled:text-red-700/50
                   disabled:cursor-not-allowed text-white h-11 rounded-xl
                   transition-all duration-200 flex items-center justify-center gap-2
                   focus:outline-none focus:ring-2 focus:ring-red-600/40">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white
                            rounded-full animate-spin"/>
            Signing in...
          </>
        ) : 'Sign In to Dashboard'}
      </button>
    </form>
  );
}
