// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple password strength
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    if (password.length < 6) return { level: 1, label: 'Weak', color: 'bg-red-400' };
    if (password.length < 8) return { level: 2, label: 'Fair', color: 'bg-amber-400' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
    return { level: 3, label: 'Good', color: 'bg-blue-400' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12" style={{ background: 'linear-gradient(135deg, #0f1724 0%, #1a2744 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
          <div className="absolute bottom-20 right-20 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, #4f6ef7, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid opacity-5" />

        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl flex items-center justify-center text-white text-base font-bold" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)' }}>
              K
            </div>
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Kollab</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white leading-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Start collaborating in minutes.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Create your workspace, invite your team, and start managing projects with ease.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: '🚀', text: 'Set up your workspace in under 2 minutes' },
              { icon: '🔒', text: 'Enterprise-grade security with Stripe payments' },
              { icon: '💬', text: 'Real-time chat built into every project' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo (mobile only) */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)' }}>
                K
              </div>
              <span className="text-xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Kollab</span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Create your account</h2>
            <p className="text-sm text-muted mt-2">Set up your workspace in minutes. No credit card required.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-red-600">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                Full Name
              </label>
              <input 
                id="name" 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="input"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                Email Address
              </label>
              <input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-1.5">
                Password
              </label>
              <input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="input"
                placeholder="••••••••"
              />
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted">{strength.label} · Must be at least 8 characters</p>
                </div>
              )}
              {!password && <p className="mt-1.5 text-xs text-muted">Must be at least 8 characters long</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-accent hover:text-accent-deep transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;