import React from 'react';
import { getInitials } from '../../utils/helpers';

export default function UserAvatar({ user, size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  const s = sizes[size] || sizes.md;

  const avatarUrl =
    user?.avatarUrl ||
    localStorage.getItem('orderpulse_avatar_url') ||
    localStorage.getItem('orderpulse_avatar');

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={user?.name || 'User'}
        className={`${s} rounded-full object-cover border border-red-700/40 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${s} rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-900/30 shrink-0 ${className}`}
    >
      <span className="font-logo text-white">{getInitials(user?.name)}</span>
    </div>
  );
}
