// Fichier: /client/src/components/Notifications.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apiClient } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/notifications');
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // Marque la notification spécifique comme lue
      await apiClient.post('/notifications/mark-read', { notificationIds: [notificationId] });
      // Rafraîchit la liste pour enlever la notification lue
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-500">Loading...</div>;
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20">
      <div className="p-4 font-bold border-b">Notifications</div>
      <div className="py-1">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Link
              key={notif._id}
              to={notif.link}
              onClick={() => handleMarkAsRead(notif._id)}
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              {notif.text}
              <div className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </div>
            </Link>
          ))
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500">No new notifications</div>
        )}
      </div>
    </div>
  );
};

export default Notifications;