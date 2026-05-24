import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AppLogo from '../../components/common/AppLogo';
import toast from 'react-hot-toast';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOAuthSession } = useAuth();
  const [status, setStatus] = useState('Processing your sign-in…');
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');
    const userStr = searchParams.get('user');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error).replace(/_/g, ' '));
      navigate('/login', { replace: true });
      return;
    }

    if (!token || !userStr) {
      toast.error('Authentication failed. Please try again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userStr));
      setOAuthSession(token, user, refreshToken);
      setStatus(`Welcome, ${user.name}!`);

      const label = provider === 'google' ? 'Google' : provider === 'facebook' ? 'Facebook' : 'OAuth';
      toast.success(`Signed in with ${label}!`);

      setTimeout(() => navigate('/dashboard', { replace: true }), 600);
    } catch {
      toast.error('Failed to process authentication');
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams, setOAuthSession]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      <div className="breathing-crimson breathing-crimson-1 pointer-events-none" aria-hidden />
      <div className="text-center relative z-10">
        <div className="flex justify-center mb-6">
          <AppLogo size="lg" showText={false} />
        </div>
        <div className="w-10 h-10 border-2 border-red-900/40 border-t-red-600 rounded-full animate-spin mx-auto mb-6" />
        <p className="font-section text-lg text-white mb-2">{status}</p>
        <p className="font-body-sm text-red-400/40">Redirecting to dashboard…</p>
      </div>
    </div>
  );
}
