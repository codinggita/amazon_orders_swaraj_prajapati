import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { systemAPI } from '../../api/system.api';
import { getRouteMeta } from '../../utils/breadcrumbs';
import UserAvatar from '../common/UserAvatar';
import NotificationDropdown from '../features/notifications/NotificationDropdown';
import AppLogo from '../common/AppLogo';

export default function Navbar({ onToggleSidebar, sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { section, title, sectionPath } = getRouteMeta(location.pathname);

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
    <header className="h-16 themed-bg border-b themed-border sticky top-0 z-40 flex items-center justify-between px-4 gap-4 backdrop-blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)' }}>
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-red-300 hover:bg-red-950/40 transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {sidebarCollapsed && (
          <Link to="/dashboard" className="hidden sm:block">
            <AppLogo size="sm" showTagline={false} />
          </Link>
        )}

        <nav className="hidden md:flex items-center gap-1.5 font-breadcrumb min-w-0" aria-label="Breadcrumb">
          <Link
            to="/dashboard"
            className="text-red-400/40 text-[12px] hover:text-red-300/70 transition-colors shrink-0"
          >
            Dashboard
          </Link>
          {section && (
            <>
              <ChevronRight className="w-3 h-3 text-red-800/40 shrink-0" />
              {sectionPath ? (
                <Link to={sectionPath} className="text-red-400/30 hover:text-red-300/70 text-[12px] shrink-0 transition-colors">
                  {section}
                </Link>
              ) : (
                <span className="text-red-400/30 text-[12px] shrink-0">{section}</span>
              )}
            </>
          )}
          <ChevronRight className="w-3 h-3 text-red-800/40 shrink-0" />
          <span className="text-red-300/70 text-[12px] font-medium truncate">{title}</span>
        </nav>
      </div>

      <div className="hidden md:flex flex-1"></div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full themed-surface2 themed-border border">
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
            <div className="absolute right-0 mt-2 w-56 themed-surface border themed-border rounded-xl shadow-xl py-1 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b themed-border">
                <p className="font-body font-semibold text-[14px] themed-text tracking-ui truncate">
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
