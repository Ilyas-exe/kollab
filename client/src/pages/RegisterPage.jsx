import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
    } catch (error) {
      console.error('Failed to register:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required className="mb-4 w-full p-2 border rounded" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="mb-4 w-full p-2 border rounded" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="mb-4 w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Sign Up</button>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-blue-500">Log in</Link></p>
      </form>
    </div>
  );
};
export default RegisterPage;