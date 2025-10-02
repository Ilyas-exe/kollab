// client/src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  useEffect(() => {
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
    // MODIFICATION : On n'attend plus de données utilisateur en retour.
    await apiClient.post('/users/register', { name, email, password });
    // On redirige vers la page de connexion avec un message.
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