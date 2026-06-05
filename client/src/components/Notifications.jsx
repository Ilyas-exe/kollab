// Fichier: /client/src/components/Notifications.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Notifications = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiClient } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/notifications');
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await apiClient.post('/notifications/mark-read', { notificationIds: [notificationId] });
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    
    try {
      const notificationIds = notifications.map(n => n._id);
      await apiClient.post('/notifications/mark-read', { notificationIds });
      setNotifications([]);
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-elevated z-50 border border-line animate-slideDown overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-line flex items-center justify-between">
        <h3 className="font-semibold text-base text-ink">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-accent hover:text-accent-deep font-semibold transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="px-4 py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-7 w-7 border-2 border-accent border-t-transparent" />
            <p className="mt-2 text-sm text-muted">Loading...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-line/60">
            {notifications.map((notif) => (
              <Link
                key={notif._id}
                to={notif.link || '#'}
                onClick={() => {
                  handleMarkAsRead(notif._id);
                  onClose();
                }}
                className="block px-4 py-3 hover:bg-pastel-blue/40 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-pastel-blue flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium leading-snug">{notif.text}</p>
                    <p className="text-xs text-muted mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="flex-shrink-0 mt-1.5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="px-4 py-12 text-center">
            <div className="empty-state-icon mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink">All caught up!</p>
            <p className="text-xs text-muted mt-1">No new notifications</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-line bg-gray-50">
          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-ink font-medium transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;