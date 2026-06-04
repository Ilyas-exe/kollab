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
      } catch {
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
      const { data } = await apiClient.post('/invitations/accept', { token, name, password });
      
      // Check if user already exists
      if (data.userExists) {
        // Existing user - redirect to login with message
        navigate('/login', {
          state: { message: 'You have been added to the project! Please log in with your existing account.' }
        });
      } else {
        // New user - redirect to login with account created message
        navigate('/login', {
          state: { message: 'Account created successfully! You can now log in.' }
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-muted">Verifying invitation...</p>;
    }

    if (error || !invitation) {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-danger mb-3">Invitation Error</h2>
          <p className="text-sm text-muted">{error}</p>
          <Link to="/login" className="mt-4 inline-block text-sm font-semibold text-ink hover:text-accent">Go to Login</Link>
        </div>
      );
    }

    return (
      <>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-ink">Join project</h2>
          <p className="text-sm text-muted mt-2">
            You've been invited to join: <span className="font-semibold text-ink">{invitation.project.name}</span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="label mb-2 block">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={invitation.email} 
              readOnly 
              className="input bg-paper text-muted" 
            />
          </div>

          <div className="border border-line bg-paper p-4">
            <p className="text-sm text-muted">
              <strong className="text-ink">Note:</strong> If you already have an account with this email, click accept below and then log in with your existing credentials. Otherwise, create your account details below.
            </p>
          </div>

          <div>
            <label htmlFor="name" className="label mb-2 block">Full Name (for new accounts)</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Leave empty if you already have an account"
              className="input" 
            />
          </div>

          <div>
            <label htmlFor="password" className="label mb-2 block">Password (for new accounts)</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave empty if you already have an account"
              className="input" 
            />
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Processing...' : 'Accept Invitation'}
            </button>
          </div>
        </form>
      </>
    );
  };
  
  return (
    <div className="app-shell flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md card-strong p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AcceptInvitationPage;