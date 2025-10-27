// src/pages/AcceptInvitationPage.jsx

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AcceptInvitationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { apiClient } = useAuth(); // We use apiClient to make public requests too

  // State for the form
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  // State for invitation details
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No invitation token found. Please use the link from your email.');
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const { data } = await apiClient.get(`/invitations/${token}`);
        if (data.success) {
          setInvitation(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Invalid or expired invitation link.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, apiClient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiClient.post('/invitations/accept', { token, name, password });
      // On success, redirect to the login page with a success message
      navigate('/login', {
        state: { message: 'Account created successfully! You can now log in.' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-text-secondary">Verifying invitation...</p>;
    }

    if (error || !invitation) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-danger mb-4">Invitation Error</h2>
          <p className="text-text-secondary">{error}</p>
          <Link to="/login" className="mt-4 inline-block text-primary hover:underline">Go to Login</Link>
        </div>
      );
    }

    return (
      <>
        <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-text-primary">Join Project on Kollab</h2>
            <p className="text-text-secondary mt-2">
                You've been invited to join the project: <span className="font-bold text-primary">{invitation.project.name}</span>
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-text-secondary block mb-2">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={invitation.email} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500" 
            />
          </div>

          <div>
            <label htmlFor="name" className="text-sm font-medium text-text-secondary block mb-2">Full Name</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" 
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-text-secondary block mb-2">Create a Password</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary" 
            />
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Accept Invitation & Create Account'}
            </button>
          </div>
        </form>
      </>
    );
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 bg-surface rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default AcceptInvitationPage;