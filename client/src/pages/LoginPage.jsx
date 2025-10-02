// client/src/pages/LoginPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  // MODIFICATION : On utilise useLocation pour récupérer l'état de la navigation
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login to Kollab</h2>
        
        {/* MODIFICATION : On affiche le message s'il existe */}
        {successMessage && (
          <p className="mb-4 text-center text-green-600 bg-green-100 p-2 rounded">
            {successMessage}
          </p>
        )}

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="mb-4 w-full p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="mb-4 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Log In</button>
        <p className="mt-4 text-center">No account? <Link to="/register" className="text-blue-500">Sign up</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;