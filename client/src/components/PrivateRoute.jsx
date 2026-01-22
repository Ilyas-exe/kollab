// src/components/PrivateRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- THIS IS THE FIX ---
// The component now accepts 'children' as a prop and handles loading state
const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If there is a token, render the children that were passed in.
  // Otherwise, navigate to the login page.
  return token ? children : <Navigate to="/login" replace />;
};
// --- END OF FIX ---

export default PrivateRoute;