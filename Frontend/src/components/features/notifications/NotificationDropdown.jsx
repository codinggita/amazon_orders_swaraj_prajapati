import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsAPI } from '../../../api/notifications.api';
import { parseNotifications } from '../../../utils/apiHelpers';
import { oauthUrl } from '../../../utils/apiBase';
import { getTimeAgo } from '../../../utils/formatters';
import { ShoppingBag, CreditCard, Truck, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import Spinner from '../../common/Spinner';

export default function NotificationDropdown({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await notificationsAPI.getAll({ limit: 5 });
      const { notifications: list } = parseNotifications(res);
      setNotifications(
        list.map((n) => ({
          ...n,
          _id: n._id ?? n.id,
        }))
      );
    } catch (err) {
      console.error('Notifications:', err);
      setFetchError(err.response?.data?.message || 'Could not load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch {
      /* silent */
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-brand-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-green-500" />;
      case 'shipping':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="fixed sm:absolute top-16 sm:top-auto right-4 sm:right-0 left-4 sm:left-auto mt-2 w-auto sm:w-80 md:w-96 bg-[#1c1112]/95 backdrop-blur-xl border border-red-900/40 rounded-xl shadow-2xl z-50 animate-scale-in flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-[#2d1515]">
        <div>
          <h3 className="font-section text-[15px] text-white">Notifications</h3>
          <p className="font-body-xs mt-0.5">{unread} unread</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Spinner />
          </div>
        ) : fetchError ? (
          <div className="p-6 text-center">
            <p className="font-body-sm text-red-400/70">{fetchError}</p>
            <button
              type="button"
              onClick={fetchNotifications}
              className="font-body-sm text-red-400 mt-2 hover:underline"
            >
              Retry
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center font-body-sm text-red-300/50">No notifications</div>
        ) : (
          <div className="divide-y divide-[#2d1515]">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 hover:bg-red-950/20 transition-colors flex gap-3 relative group ${!n.isRead ? 'bg-red-950/10' : ''}`}
              >
                {!n.isRead && (
                  <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500" />
                )}
                <div className="w-8 h-8 rounded-full bg-[#0a0a0a] border border-[#2d1515] flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-body text-[13px] truncate ${!n.isRead ? 'font-semibold text-white' : 'text-red-300/80'}`}>
                    {n.title}
                  </p>
                  <p className="font-body-sm text-[11px] text-red-300/50 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="font-timestamp mt-1">{getTimeAgo(n.createdAt)}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={(e) => handleMarkRead(n._id, e)}
                      className="p-1 rounded hover:bg-[#2d1515] text-red-400"
                      title="Mark as read"
                      aria-label="Mark as read"
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

      <div className="p-2 border-t border-[#2d1515] text-center bg-[#111] rounded-b-xl">
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
          className="font-body-sm text-brand-400 hover:text-brand-300 transition-colors"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
}
