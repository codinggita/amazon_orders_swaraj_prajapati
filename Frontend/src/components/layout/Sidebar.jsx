import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';
import UserAvatar from '../common/UserAvatar';
import Tooltip from '../common/Tooltip';
import AppLogo from '../common/AppLogo';
import {
  ChevronsLeft, ChevronsRight, LayoutDashboard, User,
  ShoppingBag, Layers, Search, BarChart3, TrendingUp,
  Users, Lightbulb, Flame, Truck, Bell, Shield, Activity, LogOut
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/profile', icon: User },
    ],
  },
  {
    label: 'Orders',
    items: [
      { name: 'All Orders', path: '/orders', icon: ShoppingBag },
      { name: 'Bulk Operations', path: '/bulk', icon: Layers },
      { name: 'Search', path: '/search', icon: Search },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Statistics', path: '/stats', icon: TrendingUp },
    ],
  },
  {
    label: 'Customers',
    items: [
      { name: 'Customers', path: '/customers', icon: Users },
      { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    ],
  },
  {
    label: 'Products',
    items: [{ name: 'Trending', path: '/trending', icon: Flame }],
  },
  {
    label: 'Shipping',
    items: [{ name: 'Shipments', path: '/shipping', icon: Truck }],
  },
  {
    label: 'System',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Admin Panel', path: '/admin', icon: Shield, adminOnly: true },
      { name: 'System Health', path: '/system', icon: Activity },
    ],
  },
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        'themed-bg border-r themed-border flex flex-col h-full transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      <div className="h-16 flex items-center justify-between px-3 border-b themed-border shrink-0">
        <Link to="/dashboard" aria-label="OrderPulse Home" className={cn('min-w-0', isCollapsed && 'mx-auto')}>
          <AppLogo size="sm" showText={!isCollapsed} showTagline={false} collapsed={isCollapsed} />
        </Link>
        {!isCollapsed ? (
          <button
            onClick={onToggleCollapse}
            className="text-red-400/50 hover:text-red-300 transition-colors p-1"
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="absolute top-4 right-2 text-red-400/50 hover:text-red-300 p-1 hidden"
            aria-label="Expand sidebar"
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mt-2 text-red-400/50 hover:text-red-300 p-1"
          aria-label="Expand sidebar"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      )}

      <Link
        to="/profile"
        aria-label="User Profile"
        className={cn(
          'mx-3 mt-3 px-3 py-3 rounded-xl themed-surface2 border themed-border',
          'hover:border-red-500/40 transition-colors shrink-0',
          isCollapsed ? 'flex justify-center' : 'block'
        )}
      >
        <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
          <UserAvatar user={user} size="md" />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-body text-sm font-semibold themed-text truncate tracking-ui">
                {user?.name || 'User'}
              </span>
              <span className="font-badge text-[9px] tracking-[0.1em] text-red-400 mt-0.5">
                ● {(user?.role || 'user').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 flex flex-col gap-2 mt-2">
        {NAV_GROUPS.map((group, i) => {
          const visibleItems = group.items.filter((item) => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={i} className="px-3">
              {!isCollapsed && (
                <p className="font-nav-label themed-muted px-3 pt-4 pb-2 select-none">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);

                  const navContent = (
                    <NavLink
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                        isCollapsed ? 'justify-center' : '',
                        isActive
                          ? 'nav-active-glow text-brand-400 border border-red-900/30 nav-item-active'
                          : 'text-red-200/50 hover:text-red-200 hover:bg-red-950/30 border border-transparent nav-item-inactive'
                      )}
                    >
                      <item.icon className={cn('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                      {!isCollapsed && (
                        <span className="font-nav text-[13.5px] truncate">{item.name}</span>
                      )}
                    </NavLink>
                  );

                  return isCollapsed ? (
                    <Tooltip key={item.path} text={item.name} position="right">
                      {navContent}
                    </Tooltip>
                  ) : (
                    <React.Fragment key={item.path}>{navContent}</React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t themed-border shrink-0">
        <button
          onClick={logout}
          aria-label="Sign Out"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors nav-item-inactive',
            isCollapsed ? 'justify-center' : ''
          )}
        >
          <LogOut className={cn('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
          {!isCollapsed && <span className="font-nav text-[13px]">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
