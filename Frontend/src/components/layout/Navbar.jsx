import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search as SearchIcon, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { systemAPI } from '../../api/system.api';
import UserAvatar from '../common/UserAvatar';
import NotificationDropdown from '../features/notifications/NotificationDropdown';
import AppLogo from '../common/AppLogo';

const PAGE_NAMES = {
  '/dashboard': 'Overview',
  '/profile': 'Profile',
  '/orders': 'All Orders',
  '/analytics': 'Analytics',
  '/stats': 'Statistics',
  '/customers': 'Customers',
  '/shipping': 'Shipments',
  '/notifications': 'Notifications',
  '/admin': 'Admin',
  '/system': 'System Health',
};

export default function Navbar({ onToggleSidebar, sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLive, setIsLive] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentPage =
    Object.entries(PAGE_NAMES).find(([path]) => location.pathname.startsWith(path))?.[1] ||
    'Dashboard';

  useEffect(() => {
    const checkPing = async () => {
      try {
        await systemAPI.ping();
        setIsLive(true);
      } catch {
        setIsLive(false);
      }
    };
    checkPing();
    const interval = setInterval(checkPing, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#2d1515]/60 sticky top-0 z-40 flex items-center justify-between px-4 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-red-300 hover:bg-red-950/40 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {sidebarCollapsed && (
          <div className="hidden sm:block">
            <AppLogo size="sm" showTagline={false} />
          </div>
        )}

        <nav className="hidden md:flex items-center gap-1.5 font-breadcrumb min-w-0">
          <span className="text-red-400/30 text-[12px]">Dashboard</span>
          <ChevronRight className="w-3 h-3 text-red-800/40 shrink-0" />
          <span className="text-red-300/60 text-[12px] font-medium truncate">{currentPage}</span>
        </nav>
      </div>

      <div className="hidden md:flex flex-1 max-w-md relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-4 h-4 text-red-400/50" />
        </div>
        <input
          type="text"
          placeholder="Search orders, customers..."
          className="font-body w-full bg-[#1c1112] border border-[#2d1515] rounded-lg h-9 pl-10 pr-12 text-[13px] text-red-100 placeholder:text-red-900/30 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="font-mono text-[10px] text-red-700/60 bg-red-950/60 border border-red-900/40 px-1.5 py-0.5 rounded-md">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1112] border border-[#2d1515]">
          <span
            className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-live' : 'bg-red-500'}`}
          />
          <span className="font-badge text-[10px] tracking-[0.08em] text-green-400">
            {isLive ? 'Live' : 'Offline'}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-red-300 hover:bg-red-950/40 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border border-[#0a0a0a]" />
          </button>
          <NotificationDropdown
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:bg-red-950/30 p-1 pr-2 rounded-lg transition-colors border border-transparent hover:border-[#2d1515]"
          >
            <UserAvatar user={user} size="sm" />
            <ChevronDown className="w-4 h-4 text-red-400/60 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1c1112] border border-red-900/40 rounded-xl shadow-xl py-1 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-[#2d1515]">
                <p className="font-body font-semibold text-[14px] text-white tracking-ui truncate">
                  {user?.name || 'User'}
                </p>
                <p className="font-body-xs text-[11px] truncate mt-0.5">{user?.email}</p>
                <span className="font-badge text-[9px] tracking-[0.1em] bg-red-900/60 text-red-300 border border-red-800/40 px-2 py-0.5 rounded-full inline-block mt-2">
                  {(user?.role || 'user').toUpperCase()}
                </span>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 font-nav text-[13px] text-red-200/80 hover:bg-red-950/40 transition-colors"
                >
                  Profile Settings
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="block w-full text-left px-4 py-2 font-nav text-[13px] text-red-200/80 hover:bg-red-950/40 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 font-nav text-[13px] text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
