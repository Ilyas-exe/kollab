// src/components/Header.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    // Use the 'surface' color for a clean white header with a shadow
    <header className="bg-surface shadow-sm">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-primary">
          Kollab
        </Link>
        <div className="flex items-center space-x-4">
          {/* We will add the notification bell icon here in a later task */}
          {user && <span className="text-text-secondary">Welcome, {user.name}</span>}
          <button onClick={logout} className="bg-danger text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-opacity-90">
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;