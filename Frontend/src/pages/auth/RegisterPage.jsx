import React from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import SocialAuthButtons from '../../components/auth/SocialAuthButtons';
import { registerSchema } from '../../validation/authSchemas';
import { Mail, Lock, User, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import SEO from '../../components/common/SEO';

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
          } ${isPassword ? 'pr-11' : ''}`}
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

function PasswordStrength({ password }) {
  const getStrength = (pass) => {
    if (!pass) return 0;
    if (pass.length < 4) return 1;
    if (pass.length < 8) return 2;
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 4;
    return 3;
  };
  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'text-red-500', 'text-orange-500', 'text-amber-400', 'text-green-500'];

  if (!password) return null;

  return (
    <>
      <div className="flex gap-1.5 h-1.5 mt-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded-full transition-colors ${
              strength >= level
                ? strength === 1
                  ? 'bg-red-500'
                  : strength === 2
                    ? 'bg-orange-500'
                    : strength === 3
                      ? 'bg-amber-400'
                      : 'bg-green-500'
                : 'bg-[#2d1515]'
            }`}
          />
        ))}
      </div>
      <p className={`font-badge text-right mt-1 ${colors[strength]}`}>{labels[strength]}</p>
    </>
  );
}

export default function RegisterPage() {
  const { register, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <SEO
        title="Create Account"
        description="Create your OrderPulse account and start managing your Amazon orders intelligently with real-time analytics and AI recommendations."
        url="/register"
        noIndex={false}
      />
      <AuthLayout
        headline="Start your journey with OrderPulse"
        subline="Create an account and unlock real-time order intelligence for your Amazon business."
      >
        <div className="glass-panel rounded-2xl p-8 sm:p-10">
          <div className="mb-6 text-center lg:text-left">
            <h1 className="font-display text-[26px] text-white tracking-display leading-tight font-bold">
              Create Account
            </h1>
            <p className="font-body text-red-300/40 mt-1.5 text-[14px]">Join OrderPulse today — it&apos;s free</p>
          </div>

          <SocialAuthButtons dividerLabel="OR REGISTER WITH EMAIL" />

          <Formik
            initialValues={{ name: '', email: '', password: '', agreeTerms: false }}
            validationSchema={registerSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const result = await register({
                name: values.name,
                email: values.email,
                password: values.password,
                confirmPassword: values.password,
              });
              setSubmitting(false);
              if (result?.success) navigate('/dashboard');
            }}
          >
            {({ errors, touched, isSubmitting, values }) => (
              <Form className="space-y-5">
                <FormField
                  label="FULL NAME"
                  name="name"
                  icon={User}
                  placeholder="Enter your name"
                  error={errors.name}
                  touched={touched.name}
                  autoComplete="name"
                />

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

                <div>
                  <FormField
                    label="PASSWORD"
                    name="password"
                    type="password"
                    icon={Lock}
                    placeholder="••••••••"
                    error={errors.password}
                    touched={touched.password}
                    autoComplete="new-password"
                  />
                  <PasswordStrength password={values.password} />
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Field
                      type="checkbox"
                      name="agreeTerms"
                      className="mt-1 rounded border-[#4b2020] bg-[#1c1112] text-brand-600 focus:ring-brand-500/30"
                    />
                    <span className="font-body text-sm text-red-300/60 leading-relaxed">
                      I agree to the{' '}
                      <span className="text-red-400 hover:underline">Terms of Service</span> and{' '}
                      <span className="text-red-400 hover:underline">Privacy Policy</span>
                    </span>
                  </label>
                  {touched.agreeTerms && errors.agreeTerms && (
                    <p className="font-body-xs text-red-400 mt-1.5">{errors.agreeTerms}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="btn-gradient-auth w-full flex items-center justify-center"
                >
                  <span className="font-display font-semibold">
                    {isSubmitting || loading ? 'Creating account…' : 'Create Account'}
                  </span>
                </button>
              </Form>
            )}
          </Formik>

          <p className="font-body text-red-300/40 text-center mt-8 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-body text-red-400 font-semibold hover:text-red-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </AuthLayout>
    </>
  );
}
