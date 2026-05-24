import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/helpers';
import { getInitials } from '../../utils/formatters';
import Tooltip from '../common/Tooltip';
import AppLogo from '../common/AppLogo';
import {
  ChevronsLeft, ChevronsRight, LayoutDashboard,
  ShoppingBag, Layers, Search, BarChart3, TrendingUp,
  Users, Lightbulb, Flame, Truck, Bell, Shield, Activity, LogOut, UserCircle
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Profile', path: '/profile', icon: UserCircle },
    ]
  },
  {
    label: 'Orders',
    items: [
      { name: 'All Orders', path: '/orders', icon: ShoppingBag },
      { name: 'Bulk Operations', path: '/bulk', icon: Layers },
      { name: 'Search', path: '/search', icon: Search }
    ]
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Statistics', path: '/stats', icon: TrendingUp }
    ]
  },
  {
    label: 'Customers',
    items: [
      { name: 'Customers', path: '/customers', icon: Users },
      { name: 'Recommendations', path: '/recommendations', icon: Lightbulb }
    ]
  },
  {
    label: 'Products',
    items: [
      { name: 'Trending', path: '/trending', icon: Flame }
    ]
  },
  {
    label: 'Shipping',
    items: [
      { name: 'Shipments', path: '/shipping', icon: Truck }
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Admin Panel', path: '/admin', icon: Shield, adminOnly: true },
      { name: 'System Health', path: '/system', icon: Activity }
    ]
  }
];

export default function Sidebar({ isOpen, isCollapsed, onToggleCollapse }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <aside
      className={cn(
        'bg-[#0a0a0a] border-r border-[#2d1515] flex flex-col h-full transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-[#2d1515] shrink-0 relative">
        <div className={cn('overflow-hidden flex-1', isCollapsed && 'flex justify-center')}>
          <Link to="/dashboard" className="block hover:opacity-90 transition-opacity">
            <AppLogo
              size="sm"
              showText={!isCollapsed}
              showTagline={!isCollapsed}
              collapsed={isCollapsed}
            />
          </Link>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-red-400/50 hover:text-red-300 transition-colors shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronsRight className="w-5 h-5" /> : <ChevronsLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* User card */}
      <div className="px-3 py-3 border-b border-[#2d1515] shrink-0">
        <div
          className={cn(
            'rounded-xl bg-red-950/30 border border-red-900/20 px-3 py-3',
            isCollapsed && 'flex justify-center px-2'
          )}
        >
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-md shadow-red-900/40 shrink-0">
              <span className="font-logo text-sm text-white">{getInitials(user?.name)}</span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-body font-semibold text-[13px] text-white tracking-[-0.01em] truncate">
                  {user?.name || 'User'}
                </span>
                <span className="font-badge text-[9px] tracking-[0.12em] text-red-400">
                  ● {(user?.role || 'user').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 flex flex-col gap-2">
        {NAV_GROUPS.map((group, i) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={i} className="px-3">
              {!isCollapsed && (
                <p className="font-label text-[9px] tracking-[0.2em] text-red-800/50 px-3 pt-4 pb-2 uppercase select-none">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {visibleItems.map(item => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

                  const navContent = (
                    <NavLink
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                        isCollapsed ? 'justify-center' : '',
                        isActive
                          ? 'bg-red-900/40 text-brand-400 border border-red-900/30'
                          : 'text-red-200/50 hover:text-red-200 hover:bg-red-950/30'
                      )}
                    >
                      <item.icon className={cn('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                      {!isCollapsed && (
                        <span className="font-nav text-[13.5px] tracking-[-0.005em] truncate">
                          {item.name}
                        </span>
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

      {/* Footer */}
      <div className="p-3 border-t border-[#2d1515] shrink-0">
        <button
          onClick={logout}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/40 transition-colors',
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
