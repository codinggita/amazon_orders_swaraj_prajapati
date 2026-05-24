const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

const dirs = [
  'layout',
  'charts',
  'features/orders',
  'features/notifications',
  'features/search'
].map(d => path.join(componentsDir, d));

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const files = {
  'layout/AuthLayout.jsx': `import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div 
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 text-white"
      style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #0a0a0a 70%)' }}
    >
      <div className="max-w-sm w-full relative z-10">
        {children}
      </div>
    </div>
  );
}
`,
  'layout/AppLayout.jsx': `import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <Sidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
`,
  'layout/Sidebar.jsx': `import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn, getInitials } from '../../utils/helpers';
import Tooltip from '../common/Tooltip';
import { 
  Activity, ChevronsLeft, ChevronsRight, LayoutDashboard, 
  ShoppingBag, Layers, Search, BarChart3, TrendingUp, 
  Users, Lightbulb, Flame, Truck, Bell, Shield, CheckCircle, Bug, LogOut
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Main',
    items: [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }]
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
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2d1515] shrink-0">
        <div className={cn('flex items-center gap-2 overflow-hidden', isCollapsed && 'hidden')}>
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white whitespace-nowrap tracking-tight">OrderPulse</span>
        </div>
        {!isCollapsed && (
          <button onClick={onToggleCollapse} className="text-red-400/50 hover:text-red-300 transition-colors">
            <ChevronsLeft className="w-5 h-5" />
          </button>
        )}
        {isCollapsed && (
          <button onClick={onToggleCollapse} className="w-8 h-8 flex items-center justify-center text-red-400/50 hover:text-red-300 transition-colors mx-auto">
            <ChevronsRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="p-4 border-b border-[#2d1515] shrink-0 flex items-center justify-center">
        <div className={cn('flex items-center gap-3', isCollapsed ? 'w-full justify-center' : 'w-full')}>
          <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {getInitials(user?.name)}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <p className="text-[10px] text-red-300/60 uppercase tracking-wider">{user?.role || 'User'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 flex flex-col gap-6">
        {NAV_GROUPS.map((group, i) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={i} className="px-3">
              {!isCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold text-red-500/40 uppercase tracking-widest">{group.label}</p>
              )}
              <div className="flex flex-col gap-1">
                {visibleItems.map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  
                  const navContent = (
                    <NavLink
                      to={item.path}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                        isCollapsed ? 'justify-center' : '',
                        isActive 
                          ? 'bg-red-900/40 text-brand-400 font-medium border border-red-900/30' 
                          : 'text-red-200/50 hover:text-red-200 hover:bg-red-950/30'
                      )}
                    >
                      <item.icon className={cn('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </NavLink>
                  );

                  return isCollapsed ? (
                    <Tooltip key={item.path} text={item.name} position="right">{navContent}</Tooltip>
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
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
`,
  'layout/Navbar.jsx': `import React, { useState, useEffect } from 'react';
import { Menu, Search as SearchIcon, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { systemAPI } from '../../api/system.api';
import { getInitials } from '../../utils/helpers';
import NotificationDropdown from '../features/notifications/NotificationDropdown';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [isLive, setIsLive] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const checkPing = async () => {
      try {
        await systemAPI.ping();
        setIsLive(true);
      } catch (e) {
        setIsLive(false);
      }
    };
    checkPing();
    const interval = setInterval(checkPing, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#2d1515]/60 sticky top-0 z-40 flex items-center justify-between px-4 gap-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md ml-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="w-4 h-4 text-red-400/50" />
        </div>
        <input
          type="text"
          placeholder="Search orders, customers..."
          className="w-full bg-[#1c1112] border border-[#2d1515] rounded-lg h-9 pl-10 pr-12 text-sm text-white placeholder:text-red-300/40 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all duration-200"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-[10px] font-medium text-red-300/40 border border-[#2d1515] px-1.5 py-0.5 rounded">⌘K</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Live Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1c1112] border border-[#2d1515]">
          <span className={\`w-2 h-2 rounded-full \${isLive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}\`}></span>
          <span className="text-xs font-medium text-red-200/70">{isLive ? 'Live' : 'Offline'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="p-2 rounded-lg text-red-300 hover:bg-red-950/40 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full border border-[#0a0a0a]"></span>
          </button>
          
          <NotificationDropdown 
            isOpen={showNotifications} 
            onClose={() => setShowNotifications(false)} 
          />
        </div>

        {/* User Menu */}
        <div className="relative ml-2">
          <button 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 hover:bg-red-950/30 p-1 pr-2 rounded-lg transition-colors border border-transparent focus:border-[#2d1515]"
          >
            <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center text-sm font-bold">
              {getInitials(user?.name)}
            </div>
            <ChevronDown className="w-4 h-4 text-red-400/60" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1c1112] border border-red-900/40 rounded-xl shadow-xl py-1 z-50 animate-scale-in">
              <div className="px-4 py-3 border-b border-[#2d1515]">
                <p className="text-sm font-semibold text-white">{user?.name || 'User'}</p>
                <p className="text-xs text-red-300/60 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button onClick={() => { setShowUserMenu(false); logout(); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 transition-colors">
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
`,
  'layout/PageHeader.jsx': `import React from 'react';

export default function PageHeader({ label, title, subtitle, actions }) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
      <div>
        {label && <p className="text-xs font-semibold text-brand-500 tracking-widest uppercase mb-1">{label}</p>}
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-red-300/60 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {actions}
        </div>
      )}
    </div>
  );
}
`
};

for (const [relPath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(componentsDir, relPath), content);
}

console.log("Layout components created successfully.");
