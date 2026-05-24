import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../../api/notifications.api';
import { getTimeAgo } from '../../../utils/formatters';
import { ShoppingBag, CreditCard, Truck, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import Spinner from '../../common/Spinner';

export default function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsAPI.getAll({ limit: 5 });
      // The backend returns { success, message, data: { notifications: [], ... } }
      setNotifications(res.data?.data?.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markRead(id);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id ? { ...n, isRead: true } : n)));
    } catch { /* ignore */ }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-4 h-4 text-red-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'shipping': return <Truck className="w-4 h-4 text-blue-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  const unread = (notifications || []).filter(n => !n.isRead).length;

  return (
    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/40 rounded-xl shadow-2xl z-50 animate-scale-in flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-[#2d1515]">
        <div>
          <h3 className="font-section text-[15px] text-white">Notifications</h3>
          <span className="font-badge text-[9px] bg-red-600 text-white px-1.5 py-0.5 rounded-full tabular-nums mt-1 inline-block">
            {unread} unread
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 flex justify-center"><Spinner /></div>
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-8 text-center font-body-sm text-red-300/50">No notifications</div>
        ) : (
          <div className="divide-y divide-[#2d1515]">
            {notifications.map(n => (
              <div
                key={n.id || n._id}
                className={`p-4 hover:bg-red-950/20 transition-colors flex gap-3 relative group ${!n.isRead ? 'bg-red-950/10' : ''}`}
              >
                {!n.isRead && <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />}
                <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#2d1515] flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-[13px] leading-snug truncate ${!n.isRead ? 'text-white font-semibold' : 'text-red-300/60 font-normal'}`}>
                    {n.title}
                  </p>
                  <p className="font-body-sm text-[11.5px] text-red-300/40 leading-relaxed line-clamp-2 mt-0.5">
                    {n.message}
                  </p>
                  <span className="font-timestamp text-[10px] text-red-500/30 mt-1 block opacity-100">
                    {getTimeAgo(n.createdAt)}
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.isRead && (
                    <button
                      onClick={(e) => handleMarkRead(n.id || n._id, e)}
                      className="p-1 rounded hover:bg-[#2d1515] text-red-400"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-2 border-t border-[#2d1515] text-center bg-[#111]/80 rounded-b-xl">
        <button
          onClick={() => { onClose(); navigate('/notifications'); }}
          className="font-body-xs text-[11px] text-red-400 hover:text-red-300 transition-colors"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
