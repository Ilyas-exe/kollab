// src/components/Header.jsx

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Notifications from './Notifications';

const Header = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const { apiClient } = useAuth();

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const { data } = await apiClient.get('/notifications');
        setUnreadCount(data.notifications?.length || 0);
      } catch (error) {
        console.error('Failed to fetch unread count', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, apiClient]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotifications]);

  const handleNotificationToggle = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0); // Reset count when opening
    }
  };

  return (
    <header className="bg-surface shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary hover:text-opacity-90 transition-colors">
          Kollab
        </Link>
        
        <div className="flex items-center space-x-6">
          {/* Notification Bell */}
          {user && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={handleNotificationToggle}
                className="relative p-2 text-text-secondary hover:text-primary hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {/* Unread badge */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-danger rounded-full">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <Notifications onClose={() => setShowNotifications(false)} />
              )}
            </div>
          )}

          {/* User info */}
          {user && (
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">{user.name}</span>
              </span>
            </div>
          )}

          {/* Logout button */}
          <button 
            onClick={logout} 
            className="bg-danger text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;