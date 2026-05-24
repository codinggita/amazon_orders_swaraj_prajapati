import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Bell, ShoppingBag, IndianRupee, Truck, Settings, AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { getTimeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      const data = res.data?.data || res.data || {};
      setNotifications(data.notifications || data.data || []);
      setUnreadCount(data.unreadCount || 0);
    } catch { toast.error('Failed to load notifications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const filtered = activeFilter === 'all' ? notifications
    : activeFilter === 'unread' ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.type === activeFilter);

  const markRead = async (id) => {
    try {
      await api.patch('/notifications/read/' + id);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { toast.error('Failed to mark as read'); }
  };

  const deleteNotif = async (id) => {
    try {
      await api.delete('/notifications/' + id);
      setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
      toast.success('Notification deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const markAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    if (!unread.length) return;
    try {
      await Promise.all(unread.map(n => api.patch('/notifications/read/' + (n._id || n.id))));
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch { toast.error('Failed to mark all as read'); }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-900/60 text-red-400"><ShoppingBag className="w-5 h-5"/></div>;
      case 'payment': return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-900/60 text-green-400"><IndianRupee className="w-5 h-5"/></div>;
      case 'shipping': return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-900/60 text-blue-400"><Truck className="w-5 h-5"/></div>;
      case 'system': return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-900/60 text-amber-400"><Settings className="w-5 h-5"/></div>;
      case 'alert': return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-900/60 text-red-400"><AlertTriangle className="w-5 h-5"/></div>;
      default: return <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2d1515] text-red-400"><Bell className="w-5 h-5"/></div>;
    }
  };

  return (
    <div>
      <PageHeader 
        label="NOTIFICATIONS" 
        title="Notifications" 
        actions={
          <div className="flex items-center gap-4">
            {unreadCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">{unreadCount} Unread</span>}
            <Button variant="secondary" onClick={markAllRead} disabled={unreadCount === 0}>Mark All Read</Button>
          </div>
        }
      />

      <div className="flex gap-2 mb-6 border-b border-[#2d1515] pb-2 overflow-x-auto">
        {['all', 'unread', 'order', 'system', 'alert'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === tab ? 'bg-red-600 text-white' : 'text-red-400 hover:text-red-300 bg-[#1c1112] border border-[#2d1515]'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {loading ? (
          Array(5).fill(0).map((_, i) => <div key={i} className="h-20 bg-red-950/20 border border-[#2d1515] rounded-xl animate-pulse"></div>)
        ) : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description={activeFilter === 'all' ? "You're all caught up!" : 'No notifications match this filter'} />
        ) : (
          filtered.map(n => (
            <div 
              key={n._id || n.id} 
              onClick={() => !n.isRead && markRead(n._id || n.id)}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer',
                n.isRead ? 'bg-[#1c1112]/50 border-[#2d1515]' : 'bg-red-950/20 border-red-900/40 border-l-2 border-l-red-600'
              )}
            >
              {getIcon(n.type)}
              <div className="flex-1">
                <p className={`text-sm font-medium ${n.isRead ? 'text-red-300/80' : 'text-white'}`}>{n.title || n.message || 'Notification'}</p>
                <p className="text-xs text-red-300/50 mt-1 line-clamp-2">{n.message || n.body || ''}</p>
                <p className="text-xs text-red-400/40 mt-2">{getTimeAgo(n.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-400"></div>}
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(n._id || n.id); }} className="text-red-400/40 hover:text-red-300 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
