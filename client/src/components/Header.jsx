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
    <header className="bg-white/6 backdrop-blur-sm sticky top-0 z-40 border-b border-white/10">
      <nav className="page-wrap py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent text-white flex items-center justify-center text-sm font-semibold rounded-md shadow-sm">
              <span className="text-sm font-semibold">K</span>
            </div>
            <span className="text-lg font-semibold text-ink tracking-tight">Kollab</span>
          </Link>
          {/* Simple top navigation */}
          <div className="hidden md:flex items-center gap-4 ml-6">
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-ink">Tableau</Link>
            <Link to="/invoices" className="text-sm text-gray-600 hover:text-ink">Factures</Link>
            <Link to="/projects" className="text-sm text-gray-600 hover:text-ink">Projets</Link>
            <Link to="/settings" className="text-sm text-gray-600 hover:text-ink">Paramètres</Link>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            {user && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationToggle}
                  className="relative p-2 border border-line text-muted hover:text-ink hover:bg-paper transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  
                  {/* Unread badge */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold text-white bg-danger border border-danger">
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
              <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-white/6 border border-white/10 rounded-full">
                <div className="h-9 w-9 bg-surface text-ink flex items-center justify-center text-sm font-semibold rounded-full">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-ink">{user.name}</span>
                  <span className="text-xs text-muted">{user.role}</span>
                </div>
              </div>
            )}

            {/* Logout button */}
            <button onClick={logout} className="px-3 py-2 text-sm text-rose-600 border border-rose-100 rounded-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;