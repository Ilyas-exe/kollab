// client/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// --- THIS IS THE FIX ---
// Create the apiClient instance OUTSIDE of the component.
// This ensures there is only ONE instance for the entire app.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
// --------------------

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    // This effect now correctly modifies the single apiClient instance's headers.
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    const { data } = await apiClient.post('/users/login', { email, password });
    setUser(data);
    setToken(data.token);
    navigate('/dashboard');
  };
  
  const register = async (name, email, password) => {
    await apiClient.post('/users/register', { name, email, password });
    navigate('/login', { 
      state: { message: 'Registration successful! Please log in.' } 
    });
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, apiClient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);