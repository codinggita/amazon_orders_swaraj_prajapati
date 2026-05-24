import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import axios from '../../api/axios';
import toast from 'react-hot-toast';
import {
  User, Mail, Shield, Clock, Calendar, Camera,
  Eye, EyeOff, Lock, LogOut, Trash2, Monitor,
  Smartphone, Globe, AlertTriangle, CheckCircle,
  XCircle, ChevronRight, Upload, X, RefreshCw,
  Key, Fingerprint, Activity
} from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('general');

  // Profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // General tab form
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [formChanged, setFormChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Email verification
  const [verificationSent, setVerificationSent] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  // OTP
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['','','','','','']);
  const otpRefs = useRef([]);
  const [verifyingOTP, setVerifyingOTP] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Security tab
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  // Sessions tab
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokingId, setRevokingId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/auth/profile');
      const data = res.data.data;
      setProfile(data);
      setFormData({ name: data.name || '', email: data.email || '' });
      // Load avatar from localStorage if saved previously
      const savedAvatar = localStorage.getItem('orderpulse_avatar');
      if (savedAvatar) setAvatarPreview(savedAvatar);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions when sessions tab is opened
  useEffect(() => {
    if (activeTab === 'sessions') fetchSessions();
  }, [activeTab]);

  const fetchSessions = async () => {
    setSessionsLoading(true);
    try {
      const res = await axios.get('/auth/sessions');
      setSessions(res.data.data?.sessions || []);
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  const getInitials = (name) =>
    (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    return score;
  };

  const getStrengthLabel = (score) => {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
    return { label: labels[score], color: colors[score] };
  };

  const getDeviceIcon = (userAgent) => {
    if (!userAgent) return Monitor;
    const ua = userAgent.toLowerCase();
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone'))
      return Smartphone;
    return Monitor;
  };

  // Close modals on escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowOTPModal(false);
        setShowDeleteModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }
    
    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP, or GIF allowed');
      return;
    }
    
    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      // Save to localStorage (since backend may not support file upload)
      localStorage.setItem('orderpulse_avatar', reader.result);
      toast.success('Profile photo updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleSendVerification = async () => {
    setSendingVerification(true);
    try {
      await axios.post('/auth/send-otp', { email: profile.email });
      setVerificationSent(true);
      setShowOTPModal(true);
      startOtpTimer();
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingVerification(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(60);
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpInput = (e, index) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pasted.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerifyOTP = async () => {
    setVerifyingOTP(true);
    try {
      await axios.post('/auth/verify-otp', {
        email: profile.email,
        otp: otp.join('')
      });
      setProfile(prev => ({ ...prev, isEmailVerified: true }));
      setShowOTPModal(false);
      setOtp(['','','','','','']);
      toast.success('Email verified successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
      // Shake animation on failure
      setOtp(['','','','','','']);
      otpRefs.current[0]?.focus();
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return;
    }
    setSaving(true);
    try {
      const res = await axios.patch('/auth/profile', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase()
      });
      setProfile(res.data.data);
      setFormChanged(false);
      // Update global context which updates localStorage and triggers re-render
      updateUser({ name: formData.name, email: formData.email });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordStrength < 3) {
      toast.error('Password is too weak');
      return;
    }
    setChangingPassword(true);
    try {
      await axios.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordStrength(0);
      toast.success('Password changed successfully! Please log in again.');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        localStorage.removeItem('orderpulse_token');
        localStorage.removeItem('orderpulse_user');
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      await axios.delete('/auth/profile');
      localStorage.clear();
      toast.success('Account deactivated. Goodbye!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    setRevokingId(sessionId);
    try {
      await axios.delete('/auth/sessions/' + sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast.success('Session revoked successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke session');
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    if (sessions.length <= 1) return;
    setRevokingAll(true);
    try {
      const otherSessions = sessions.slice(1); // Keep first (current) session
      await Promise.all(otherSessions.map(s =>
        axios.delete('/auth/sessions/' + s.id)
      ));
      setSessions(prev => [prev[0]]); // Keep only current
      toast.success(`${otherSessions.length} sessions revoked`);
    } catch (err) {
      toast.error('Failed to revoke all sessions');
    } finally {
      setRevokingAll(false);
    }
  };

  // --- Sub-components to keep layout cleaner ---
  const GeneralTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT COLUMN: Profile Info Card */}
      <div className="bg-[#1c1112] border border-[#4b2020] rounded-2xl p-8">
        {/* AVATAR SECTION (top, centered) */}
        <div className="relative w-28 h-28 mx-auto">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar"
                 className="w-28 h-28 rounded-2xl object-cover
                            border-2 border-red-600/40 shadow-lg shadow-red-900/30"/>
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-600 to-red-800
                            flex items-center justify-center border-2 border-red-600/40
                            shadow-lg shadow-red-900/30">
              <span className="font-logo text-[36px] text-white tracking-[-0.04em]">
                {getInitials(profile?.name)}
              </span>
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl
                       bg-red-600 hover:bg-red-700 border-2 border-[#0a0a0a]
                       flex items-center justify-center transition-all duration-200
                       hover:scale-110 shadow-lg shadow-red-900/40 group">
            <Camera className="w-4 h-4 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        
        {avatarPreview && (
          <button
            onClick={() => {
              setAvatarPreview(null);
              setAvatarFile(null);
              localStorage.removeItem('orderpulse_avatar');
              toast.success('Profile photo removed');
            }}
            className="mt-3 font-body-xs text-[11px] text-red-400/60
                       hover:text-red-400 transition-colors flex items-center
                       gap-1 mx-auto">
            <X className="w-3 h-3" /> Remove photo
          </button>
        )}

        {/* USER INFO (below avatar, centered) */}
        <h2 className="font-logo text-[22px] text-white tracking-[-0.03em] text-center mt-4">
          {profile?.name}
        </h2>
        <p className="font-body-sm text-[12px] text-red-300/50 text-center mt-1">
          {profile?.email}
        </p>
        <div className="flex justify-center mt-3 mb-6">
          <span className="font-badge text-[10px] tracking-[0.1em]
                           bg-red-900/60 text-red-300 border border-red-700/50
                           px-3 py-1 rounded-full uppercase">
            {profile?.role || 'User'}
          </span>
        </div>

        {/* INFO CARDS (stacked below) */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-[#2d1515]/40 border border-[#4b2020]/60 rounded-xl">
            <Shield className="text-red-500 w-5 h-5 flex-shrink-0"/>
            <div>
              <p className="font-label text-[9px] tracking-[0.18em] text-red-400/40 uppercase">ROLE</p>
              <p className="font-body text-[14px] text-white font-medium capitalize">{profile?.role || 'User'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-[#2d1515]/40 border border-[#4b2020]/60 rounded-xl">
            {profile?.isEmailVerified ? (
              <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0"/>
            ) : (
              <XCircle className="text-red-500 w-5 h-5 flex-shrink-0"/>
            )}
            <div className="flex-1">
              <p className="font-label text-[9px] tracking-[0.18em] text-red-400/40 uppercase">EMAIL</p>
              <p className={`font-body text-[14px] font-medium ${profile?.isEmailVerified ? 'text-green-400' : 'text-red-400'}`}>
                {profile?.isEmailVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            {!profile?.isEmailVerified && (
              <button
                onClick={handleSendVerification}
                disabled={sendingVerification || verificationSent}
                className="font-badge text-[10px] tracking-[0.05em]
                           bg-red-900/60 hover:bg-red-900 text-red-300
                           border border-red-700/40 px-3 py-1.5 rounded-lg
                           transition-colors ml-auto flex-shrink-0
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {verificationSent ? '✓ Sent' : sendingVerification ? 'Sending...' : 'Verify Email'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#2d1515]/40 border border-[#4b2020]/60 rounded-xl">
            <Clock className="text-red-500 w-5 h-5 flex-shrink-0"/>
            <div>
              <p className="font-label text-[9px] tracking-[0.18em] text-red-400/40 uppercase">LAST LOGIN</p>
              <p className="font-mono text-[13px] text-white">{formatDateTime(profile?.lastLogin)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#2d1515]/40 border border-[#4b2020]/60 rounded-xl">
            <Calendar className="text-red-500 w-5 h-5 flex-shrink-0"/>
            <div>
              <p className="font-label text-[9px] tracking-[0.18em] text-red-400/40 uppercase">MEMBER SINCE</p>
              <p className="font-mono text-[13px] text-white">{formatDateTime(profile?.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Edit Profile Card */}
      <div className="bg-[#1c1112] border border-[#4b2020] rounded-2xl p-8">
        <h3 className="font-section text-[20px] text-white tracking-[-0.02em] mb-6">Edit Profile</h3>
        
        {/* CONNECTED ACCOUNTS SECTION */}
        <div className="mb-6 p-5 bg-[#2d1515]/40 border border-[#4b2020]/60 rounded-xl">
          <p className="font-label text-[9px] tracking-[0.18em] text-red-400/40 uppercase mb-4 block">Connected Accounts</p>
          
          {/* Google Row */}
          <div className="flex items-center justify-between py-3 border-b border-[#4b2020]/40 last:border-0">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              <span className="font-body text-[14px] text-white">Google</span>
            </div>
            {profile?.googleId || profile?.authProvider === 'google' || profile?.authProvider === 'both' ? (
              <span className="flex items-center gap-2 font-badge text-[10px] text-green-400 tracking-[0.05em]">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                Connected
              </span>
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api/v1'}/auth/google`}
                className="font-badge text-[10px] tracking-[0.05em] bg-red-950 hover:bg-red-900 text-red-400 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors">
                Connect
              </a>
            )}
          </div>

          {/* Facebook Row */}
          <div className="flex items-center justify-between py-3 last:border-0">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-body text-[14px] text-white">Facebook</span>
            </div>
            {profile?.facebookId || profile?.authProvider === 'facebook' || profile?.authProvider === 'both' ? (
              <span className="flex items-center gap-2 font-badge text-[10px] text-green-400 tracking-[0.05em]">
                <div className="w-2 h-2 rounded-full bg-green-500"/>
                Connected
              </span>
            ) : (
              <a
                href={`${import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api/v1'}/auth/facebook`}
                className="font-badge text-[10px] tracking-[0.05em] bg-red-950 hover:bg-red-900 text-red-400 border border-red-800/40 px-3 py-1.5 rounded-lg transition-colors">
                Connect
              </a>
            )}
          </div>
        </div>

        {/* FORM FIELDS */}
        <div className="space-y-5">
          <div>
            <label className="font-label text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-2">FULL NAME</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
              <input
                value={formData.name}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setFormChanged(true);
                }}
                className="input-dark font-body text-[14px] pl-10 w-full bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>
            </div>
          </div>
          
          <div>
            <label className="font-label text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-2">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
              <input
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  setFormChanged(true);
                }}
                type="email"
                className="input-dark font-body text-[14px] pl-10 w-full bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>
            </div>
          </div>
        </div>
        
        {formChanged && (
          <p className="font-body-xs text-[11px] text-amber-400/70 flex items-center gap-1.5 mt-4">
            <AlertTriangle className="w-3 h-3" />
            You have unsaved changes
          </p>
        )}
        
        {/* ACTION BUTTONS row */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-[#2d1515]">
          <button
            onClick={handleSaveProfile}
            disabled={!formChanged || saving}
            className="font-btn text-[14px] bg-red-600 hover:bg-red-700
                       disabled:bg-red-900/40 disabled:text-red-700/50
                       disabled:cursor-not-allowed text-white px-6 h-11
                       rounded-xl transition-all duration-200 flex items-center gap-2">
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
          
          <button
            onClick={() => {
              setFormData({ name: profile?.name || '', email: profile?.email || '' });
              setFormChanged(false);
            }}
            disabled={!formChanged}
            className="font-btn text-[14px] bg-[#2d1515] hover:bg-[#3d1f1f]
                       disabled:opacity-40 disabled:cursor-not-allowed
                       text-red-300 border border-[#4b2020] px-6 h-11
                       rounded-xl transition-all duration-200">
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6 max-w-2xl">
      {/* SECTION 1: Change Password Card */}
      <div className="bg-[#1c1112] border border-[#4b2020] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Key className="text-red-500 w-5 h-5"/>
          <h3 className="font-section text-[18px] text-white">Change Password</h3>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="font-label text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-2">CURRENT PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(p => ({...p, currentPassword: e.target.value}))}
                className="input-dark font-body text-[14px] pl-10 pr-10 w-full bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({...p, current: !p.current}))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-500 transition-colors">
                {showPasswords.current ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
          </div>
          
          <div>
            <label className="font-label text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-2">NEW PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => {
                  setPasswordForm(p => ({...p, newPassword: e.target.value}));
                  setPasswordStrength(getPasswordStrength(e.target.value));
                }}
                className="input-dark font-body text-[14px] pl-10 pr-10 w-full bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({...p, new: !p.new}))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-500 transition-colors">
                {showPasswords.new ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
            {passwordForm.newPassword && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i}
                         className="h-1 flex-1 rounded-full transition-all duration-300"
                         style={{
                           backgroundColor: i <= passwordStrength
                             ? getStrengthLabel(passwordStrength).color
                             : '#2d1515'
                         }}/>
                  ))}
                </div>
                <p className="font-body-xs text-[11px] mt-1"
                   style={{ color: getStrengthLabel(passwordStrength).color }}>
                  {getStrengthLabel(passwordStrength).label}
                </p>
                <ul className="mt-3 space-y-1">
                  {[
                    { check: passwordForm.newPassword.length >= 8, label: 'At least 8 characters' },
                    { check: /[A-Z]/.test(passwordForm.newPassword), label: 'One uppercase letter' },
                    { check: /[0-9]/.test(passwordForm.newPassword), label: 'One number' },
                    { check: /[@$!%*?&]/.test(passwordForm.newPassword), label: 'One special character (@$!%*?&)' },
                  ].map(({ check, label }) => (
                    <li key={label} className="flex items-center gap-2">
                      {check ? (
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0"/>
                      ) : (
                        <XCircle className="w-3 h-3 text-red-800/60 flex-shrink-0"/>
                      )}
                      <span className={`font-body-xs text-[11px] ${check ? 'text-green-400/80' : 'text-red-400/40'}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div>
            <label className="font-label text-[9px] tracking-[0.18em] text-red-400/50 uppercase block mb-2">CONFIRM PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(p => ({...p, confirmPassword: e.target.value}))}
                className="input-dark font-body text-[14px] pl-10 pr-10 w-full bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>
              <button
                type="button"
                onClick={() => setShowPasswords(p => ({...p, confirm: !p.confirm}))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-700 hover:text-red-500 transition-colors">
                {showPasswords.confirm ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
              </button>
            </div>
            {passwordForm.confirmPassword && (
              <p className={`font-body-xs text-[11px] mt-1 flex items-center gap-1
                ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                {passwordForm.newPassword === passwordForm.confirmPassword
                  ? <><CheckCircle className="w-3 h-3"/> Passwords match</>
                  : <><XCircle className="w-3 h-3"/> Passwords don't match</>}
              </p>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-[#2d1515]">
          <button
            onClick={handleChangePassword}
            disabled={changingPassword || !passwordForm.currentPassword ||
                      !passwordForm.newPassword || !passwordForm.confirmPassword ||
                      passwordForm.newPassword !== passwordForm.confirmPassword ||
                      passwordStrength < 3}
            className="font-btn text-[14px] bg-red-600 hover:bg-red-700
                       disabled:bg-red-900/40 disabled:text-red-700/50
                       text-white px-6 h-11 rounded-xl transition-all duration-200
                       flex items-center gap-2">
            {changingPassword ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Changing...</>
            ) : (
              <><Lock className="w-4 h-4"/> Change Password</>
            )}
          </button>
        </div>
      </div>
      
      {/* SECTION 2: Danger Zone Card */}
      <div className="bg-[#1c1112] border border-red-900/60 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="text-red-500 w-5 h-5"/>
          <h3 className="font-section text-[18px] text-red-400">Danger Zone</h3>
        </div>
        <p className="font-body-sm text-[12px] text-red-300/40 mb-6">
          Irreversible actions that affect your account permanently
        </p>
        
        <div className="flex items-center justify-between p-4 bg-red-950/30 border border-red-900/40 rounded-xl">
          <div>
            <p className="font-body text-[14px] font-semibold text-red-300">Delete Account</p>
            <p className="font-body-xs text-[11px] text-red-400/40 mt-0.5">
              Permanently deactivate your account. All data will be lost.
            </p>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="font-btn text-[13px] bg-red-950 hover:bg-red-900
                       text-red-400 hover:text-red-300 border border-red-800/60
                       px-4 h-9 rounded-lg transition-all duration-200
                       flex items-center gap-2 flex-shrink-0">
            <Trash2 className="w-4 h-4"/>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const SessionsTab = () => (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-section text-[20px] text-white">Active Sessions</h2>
          <span className="font-badge text-[10px] tracking-[0.05em] text-red-400/60 uppercase">
            {sessions.length} active
          </span>
        </div>
        <button
          onClick={handleRevokeAll}
          disabled={revokingAll || sessions.length <= 1}
          className="font-btn text-[13px] bg-red-950 hover:bg-red-900
                     text-red-400 border border-red-800/40
                     px-4 h-9 rounded-lg transition-colors
                     flex items-center gap-2
                     disabled:opacity-40 disabled:cursor-not-allowed">
          {revokingAll ? (
            <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"/>
          ) : (
            <LogOut className="w-4 h-4"/>
          )}
          Revoke All Others
        </button>
      </div>

      <div className="space-y-4">
        {sessionsLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#1c1112] border border-[#4b2020] rounded-2xl p-5 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2d1515]"/>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#2d1515] rounded w-1/3"/>
                  <div className="h-3 bg-[#2d1515] rounded w-1/2"/>
                  <div className="h-3 bg-[#2d1515] rounded w-1/4"/>
                </div>
              </div>
            </div>
          ))
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <Monitor className="w-12 h-12 text-red-800/40 mx-auto mb-4" />
            <p className="font-section text-[18px] text-red-400/40">No active sessions</p>
            <p className="font-body-sm text-red-400/20 mt-2">You don't have any other active sessions</p>
          </div>
        ) : (
          sessions.map((session, index) => {
            const isCurrentSession = index === 0; // Assume first is current based on rules
            const DeviceIcon = getDeviceIcon(session.userAgent);
            return (
              <div key={session.id || session._id} className="bg-[#1c1112] border border-[#4b2020] rounded-2xl p-5 hover:border-red-800/50 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-900/30 flex items-center justify-center flex-shrink-0">
                    <DeviceIcon className="w-5 h-5 text-red-500"/>
                  </div>
                  <div className="flex-1">
                    <p className="font-body text-[14px] font-semibold text-white flex items-center gap-2">
                      {session.deviceInfo || 'Unknown Device'}
                      {isCurrentSession && (
                        <span className="font-badge text-[9px] tracking-[0.08em] bg-green-900/40 text-green-400 border border-green-800/40 px-2 py-0.5 rounded-full">
                          CURRENT
                        </span>
                      )}
                    </p>
                    <p className="font-body-xs text-[12px] text-red-300/50 mt-1 flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-red-700"/>
                      <span className="font-mono">{session.ipAddress || 'Unknown IP'}</span>
                    </p>
                    <p className="font-timestamp text-[11px] text-red-400/30 mt-1 flex items-center gap-1.5">
                      <Clock className="w-3 h-3"/>
                      {formatDateTime(session.createdAt)}
                    </p>
                    <p className="font-timestamp text-[11px] text-red-400/20 mt-0.5 flex items-center gap-1.5">
                      <Activity className="w-3 h-3"/>
                      Expires: {formatDateTime(session.expiresAt)}
                    </p>
                  </div>
                  {!isCurrentSession && (
                    <button
                      onClick={() => handleRevokeSession(session.id || session._id)}
                      disabled={revokingId === (session.id || session._id)}
                      className="font-badge text-[10px] tracking-[0.05em]
                                 bg-red-950 hover:bg-red-900 text-red-400
                                 border border-red-800/40 px-3 h-8 rounded-lg
                                 transition-colors flex-shrink-0 flex items-center gap-1.5
                                 disabled:opacity-50 disabled:cursor-not-allowed">
                      {revokingId === (session.id || session._id) ? (
                        <div className="w-3 h-3 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"/>
                      ) : (
                        <><LogOut className="w-3 h-3"/> Revoke</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const OTPModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/40 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-red-950/50 relative">
        <button onClick={() => setShowOTPModal(false)} className="absolute top-4 right-4 text-red-400/60 hover:text-red-400">
          <X className="w-5 h-5"/>
        </button>
        <Shield className="text-red-500 w-12 h-12 mx-auto mb-4" />
        <h2 className="font-hero text-[24px] text-white text-center mb-2">Verify Email</h2>
        <p className="font-body-sm text-center text-red-300/50 mb-1">Enter the 6-digit OTP sent to</p>
        <p className="font-mono text-[13px] text-red-400 text-center">
          {profile?.email ? `${profile.email[0]}***@${profile.email.split('@')[1]}` : ''}
        </p>

        <div className="flex gap-2 justify-center my-6">
          {[0,1,2,3,4,5].map(i => (
            <input
              key={i}
              ref={el => otpRefs.current[i] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleOtpInput(e, i)}
              onKeyDown={(e) => handleOtpKeyDown(e, i)}
              onPaste={i === 0 ? handleOtpPaste : undefined}
              className={`w-11 h-13 text-center font-metric text-[20px] text-white
                          rounded-xl border-2 bg-[#0d0d0d] outline-none
                          transition-all duration-200 caret-red-500
                          ${otp[i] ? 'border-red-500 bg-red-950/20' : 'border-[#2d1515]'}
                          focus:border-red-500 focus:ring-2 focus:ring-red-500/20`}
            />
          ))}
        </div>

        <div className="mb-6">
          {otpTimer > 0 ? (
            <p className="font-mono text-[12px] text-red-400/40 text-center">
              Resend in 0:{String(otpTimer).padStart(2, '0')}
            </p>
          ) : (
            <button onClick={handleSendVerification}
                    className="font-body-sm text-[12px] text-red-400 hover:text-red-300 text-center w-full transition-colors">
              Resend OTP
            </button>
          )}
        </div>

        <button
          onClick={handleVerifyOTP}
          disabled={otp.join('').length < 6 || verifyingOTP}
          className="w-full font-btn text-[14px] bg-red-600 hover:bg-red-700
                     disabled:bg-red-900/40 disabled:text-red-700/50
                     text-white h-11 rounded-xl transition-all duration-200
                     flex items-center justify-center gap-2">
          {verifyingOTP ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Verifying...</>
          ) : 'Verify OTP'}
        </button>
      </div>
    </div>
  );

  const DeleteAccountModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/40 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-red-950/50 relative">
        <button onClick={() => setShowDeleteModal(false)} className="absolute top-4 right-4 text-red-400/60 hover:text-red-400">
          <X className="w-5 h-5"/>
        </button>
        <Trash2 className="text-red-500 w-12 h-12 mx-auto mb-4" />
        <h2 className="font-hero text-[24px] text-red-400 text-center mb-2">Delete Account</h2>
        <p className="font-body-sm text-center text-red-300/50">
          This action cannot be undone. Your account will be permanently deactivated.
        </p>

        <p className="font-body-sm text-[12px] text-red-300/50 mt-6 mb-2">
          Type <span className="font-mono text-red-400">DELETE</span> to confirm
        </p>
        <input
          value={deleteConfirmText}
          onChange={(e) => setDeleteConfirmText(e.target.value)}
          placeholder="Type DELETE here"
          className="input-dark font-mono text-[14px] w-full mb-6 bg-[#0d0d0d] border border-[#2d1515] text-white placeholder-red-900/30 rounded-xl px-4 h-11 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-colors"/>

        <div className="flex gap-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 font-btn text-[14px] bg-[#2d1515] text-red-300 border border-[#4b2020] h-11 rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== 'DELETE' || deleting}
            className="flex-1 font-btn text-[14px] bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white h-11 rounded-xl flex items-center justify-center gap-2">
            {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      {/* PAGE HEADER */}
      <div className="mb-8">
        <p className="font-label text-[10px] tracking-[0.25em] text-red-500 uppercase mb-2">
          ACCOUNT SETTINGS
        </p>
        <h1 className="font-hero text-[42px] text-white tracking-[-0.03em] leading-none">
          Profile
        </h1>
        <p className="font-body text-[13px] text-red-300/40 mt-2">
          Manage your account, security, and active sessions
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-0 border-b border-[#2d1515] mb-8">
        {['general', 'security', 'sessions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-badge text-[11px] tracking-[0.08em] uppercase
                        pb-3 px-1 mr-8 border-b-2 transition-all duration-200
                        ${activeTab === tab
                          ? 'border-red-500 text-white'
                          : 'border-transparent text-red-400/50 hover:text-red-300/70'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-900/30 border-t-red-600 rounded-full animate-spin"/>
        </div>
      ) : (
        <>
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'sessions' && <SessionsTab />}
        </>
      )}

      {/* MODALS */}
      {showOTPModal && <OTPModal />}
      {showDeleteModal && <DeleteAccountModal />}
    </div>
  );
}
