import React, { useState } from 'react';
import { useNavigate, Link, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AppLogo from '../../components/common/AppLogo';
import Spinner from '../../components/common/Spinner';
import { Mail, Lock, Eye, EyeOff, BarChart3, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const FEATURES = [
  { icon: BarChart3, text: 'Real-time order analytics' },
  { icon: Shield, text: 'Secure seller dashboard' },
  { icon: Zap, text: 'Instant operational insights' },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const [searchParams] = useSearchParams();
  const oauthError = searchParams.get('error');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const success = await login(values);
      if (success) navigate(from, { replace: true });
      setSubmitting(false);
    },
  });

  if (authLoading) {
    return (
      <AuthLayout wide>
        <Spinner fullScreen size="xl" overlay />
      </AuthLayout>
    );
  }

  if (isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  return (
    <AuthLayout wide>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Left — brand panel (desktop) */}
        <div className="hidden lg:flex flex-col justify-center pr-8">
          <AppLogo size="lg" showText showTagline />
          <h2 className="font-hero text-4xl text-white mt-10 tracking-[-0.03em] leading-tight">
            The heartbeat of<br />
            <span className="text-gradient-brand">your business</span>
          </h2>
          <p className="font-body text-red-300/45 mt-4 max-w-sm leading-relaxed">
            Monitor orders, revenue, and fulfillment from one premium command center built for Amazon sellers.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-800/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-red-400" />
                </div>
                <span className="font-body text-[14px] text-red-200/70">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl border border-[#4b2020]/60 relative overflow-hidden">
          {formik.isSubmitting && <Spinner overlay size="lg" />}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <AppLogo size="md" showText showTagline />
          </div>

          <div className="mb-8">
            <h1 className="font-hero text-[28px] text-white tracking-[-0.03em] leading-tight">
              Welcome Back
            </h1>
            <p className="font-body-sm text-[13px] text-red-300/50 mt-2">
              Sign in to access your dashboard
            </p>
          </div>

          {oauthError && ( 
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl 
                            flex items-center gap-2"> 
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0"/> 
              <p className="font-body-sm text-[12px] text-red-400"> 
                {oauthError.replace(/_/g, ' ')} 
              </p> 
            </div> 
          )} 

          <div className="space-y-3 mb-6">
            <a
              href={`${import.meta.env.VITE_API_URL}/auth/google`}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 
                        bg-white hover:bg-gray-50 text-gray-700 font-semibold 
                        rounded-xl border border-gray-200 transition-all duration-200 
                        hover:shadow-lg hover:shadow-gray-200/50 font-btn text-[14px]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </a>

            <a
              href={`${import.meta.env.VITE_API_URL}/auth/facebook`}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 
                        bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold 
                        rounded-xl transition-all duration-200 
                        hover:shadow-lg hover:shadow-blue-900/40 font-btn text-[14px]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </a>
          </div>

          <div className="flex items-center gap-3 my-4"> 
            <div className="flex-1 h-px bg-[#2d1515]"/> 
            <span className="font-label text-[9px] tracking-[0.15em] text-red-800/60"> 
              OR SIGN IN WITH EMAIL 
            </span> 
            <div className="flex-1 h-px bg-[#2d1515]"/> 
          </div> 

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@orderpulse.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              icon={Mail}
              error={formik.touched.email && formik.errors.email ? formik.errors.email : null}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              icon={Lock}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-0 border-0 bg-transparent text-red-400/60 hover:text-red-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              error={formik.touched.password && formik.errors.password ? formik.errors.password : null}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#4b2020] bg-[#0d0d0d] text-brand-600 focus:ring-brand-500/30" />
                <span className="font-body-sm text-[12px] text-red-300/60">Remember me</span>
              </label>
              <button type="button" className="font-body-sm text-[12px] text-red-400 hover:text-red-300 transition-colors">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full h-12 mt-2 btn-gradient-auth" loading={formik.isSubmitting}>
              <span className="font-btn text-[14px]">Sign In to Dashboard</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2d1515] text-center">
            <span className="font-body-sm text-[13px] text-red-300/45">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
                Create Account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
