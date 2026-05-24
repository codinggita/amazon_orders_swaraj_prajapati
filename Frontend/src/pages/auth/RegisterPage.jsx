import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AppLogo from '../../components/common/AppLogo';
import { Mail, Lock, User, Eye, EyeOff, Package, TrendingUp, Bell } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Full Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .matches(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)'),
  agreeTerms: Yup.boolean().oneOf([true], 'You must accept the terms'),
});

const FEATURES = [
  { icon: Package, text: 'Unified order management' },
  { icon: TrendingUp, text: 'Revenue & analytics insights' },
  { icon: Bell, text: 'Smart alerts & notifications' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoggedIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', agreeTerms: false },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.password,
      });
      if (result?.success) {
        navigate(result.autoLogin ? '/dashboard' : '/login');
      }
      setSubmitting(false);
    },
  });

  if (authLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthLayout>
    );
  }

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const strength = getPasswordStrength(formik.values.password);

  return (
    <AuthLayout wide>
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:flex flex-col justify-center pr-8">
          <AppLogo size="lg" showText showTagline />
          <h2 className="font-hero text-4xl text-white mt-10 tracking-[-0.03em] leading-tight">
            Start managing<br />
            <span className="text-gradient-brand">orders smarter</span>
          </h2>
          <p className="font-body text-red-300/45 mt-4 max-w-sm leading-relaxed">
            Join thousands of sellers using OrderPulse to track performance and grow revenue.
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

        <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl border border-[#4b2020]/60">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <AppLogo size="md" showText showTagline />
          </div>

          <div className="mb-8">
            <h1 className="font-hero text-[28px] text-white tracking-[-0.03em] leading-tight">
              Create Account
            </h1>
            <p className="font-body-sm text-[13px] text-red-300/50 mt-2">
              Free to start — set up in under a minute
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              icon={User}
              error={formik.touched.name && formik.errors.name ? formik.errors.name : null}
            />

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

            <div className="space-y-2">
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
              <div className="flex gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 rounded-full transition-colors ${
                      strength >= level
                        ? strength === 1 ? 'bg-red-500'
                        : strength === 2 ? 'bg-orange-500'
                        : strength === 3 ? 'bg-amber-400'
                        : 'bg-emerald-500'
                        : 'bg-[#2d1515]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formik.values.agreeTerms}
                onChange={formik.handleChange}
                className="mt-1 rounded border-[#4b2020] bg-[#0d0d0d] text-brand-600 focus:ring-brand-500/30"
              />
              <span className="font-body-xs text-[12px] leading-relaxed opacity-90">
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>
            {formik.touched.agreeTerms && formik.errors.agreeTerms && (
              <p className="font-body-xs text-red-500">{formik.errors.agreeTerms}</p>
            )}

            <Button type="submit" className="w-full h-12 mt-4" loading={formik.isSubmitting}>
              <span className="font-btn text-[14px]">Create Account</span>
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#2d1515] text-center">
            <span className="font-body-sm text-[13px] text-red-300/45">
              Already have an account?{' '}
              <Link to="/login" className="text-red-400 font-semibold hover:text-red-300 transition-colors">
                Sign In
              </Link>
            </span>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

function getPasswordStrength(pass) {
  if (!pass) return 0;
  if (pass.length < 4) return 1;
  if (pass.length < 8) return 2;
  if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[@$!%*?&]/.test(pass)) return 4;
  if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return 3;
  return 2;
}
