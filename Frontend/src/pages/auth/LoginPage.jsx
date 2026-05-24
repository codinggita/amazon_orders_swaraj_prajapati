import React, { useEffect } from 'react';
import { useNavigate, Link, Navigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';
import { loginSchema } from '../../validation/authSchemas';
import { Mail, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

function FormField({ label, name, type = 'text', icon: Icon, error, touched, ...rest }) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div>
      <label htmlFor={name} className="font-table-header text-[9px] tracking-[0.18em] text-red-400/50 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400/50 pointer-events-none" />
        )}
        <Field
          id={name}
          name={name}
          type={inputType}
          className={`font-body w-full bg-[#0d0d0d] border rounded-lg h-11 text-[13px] text-white pl-11 pr-4 placeholder:text-red-900/40 focus:outline-none focus:ring-1 transition-all ${
            touched && error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-[#2d1515] focus:border-red-600 focus:ring-red-600/30'
          }`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400/50 hover:text-red-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {touched && error && (
        <p className="font-body-xs text-red-400 mt-1.5 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { login, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const oauthError = searchParams.get('error');

  useEffect(() => {
    if (oauthError) {
      toast.error(oauthError.replace(/_/g, ' '));
      setSearchParams({}, { replace: true });
    }
  }, [oauthError, setSearchParams]);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout headline="Welcome back to your command center">
      <div className="glass-panel rounded-2xl p-8 sm:p-10">
        <div className="mb-6 text-center lg:text-left">
          <h1 className="font-display text-[26px] text-white tracking-display leading-tight font-bold">
            Welcome Back
          </h1>
          <p className="font-body text-red-300/40 mt-1.5 text-[14px]">Sign in to your account</p>
        </div>

        {oauthError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="font-body text-[12px] text-red-400">
              {oauthError.replace(/_/g, ' ')}
            </p>
          </div>
        )}

        <SocialAuthButtons />

        <Formik
          initialValues={{ email: '', password: '', remember: false }}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const ok = await login({ email: values.email, password: values.password });
            setSubmitting(false);
            if (ok) navigate('/dashboard');
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              <FormField
                label="EMAIL ADDRESS"
                name="email"
                type="email"
                icon={Mail}
                placeholder="Enter your email"
                error={errors.email}
                touched={touched.email}
                autoComplete="email"
              />

              <FormField
                label="PASSWORD"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password}
                touched={touched.password}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Field
                    type="checkbox"
                    name="remember"
                    className="rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30"
                  />
                  <span className="font-body text-sm text-red-300/60">Remember me</span>
                </label>
                <button
                  type="button"
                  className="font-body text-sm text-red-400/70 hover:text-red-400 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn-gradient-auth w-full flex items-center justify-center"
              >
                <span className="font-display font-semibold">
                  {isSubmitting || loading ? 'Signing in…' : 'Sign In to Dashboard'}
                </span>
              </button>
            </Form>
          )}
        </Formik>

        <p className="font-body text-red-300/40 text-center mt-8 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-body text-red-400 font-semibold hover:text-red-300 transition-colors"
          >
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
