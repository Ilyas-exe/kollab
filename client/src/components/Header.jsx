// Fichier: /client/src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications'; // Importer le composant

const Header = () => {
  const { user, logout, apiClient } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // On va vérifier périodiquement s'il y a de nouvelles notifications
    const fetchCount = async () => {
      try {
        const { data } = await apiClient.get('/notifications?limit=1'); // On a juste besoin du total
        setUnreadCount(data.totalUnread || 0);
      } catch (error) {
        console.error("Could not fetch notification count", error);
      }
    };

    fetchCount(); // Appel immédiat
    const interval = setInterval(fetchCount, 30000); // Puis toutes les 30 secondes

    return () => clearInterval(interval); // Nettoyage
  }, [apiClient]);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-xl font-bold">Kollab</Link>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>
          {showNotifications && <Notifications />}
        </div>
        <span>Welcome, {user?.name}</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </header>
  );
};

export default Header;