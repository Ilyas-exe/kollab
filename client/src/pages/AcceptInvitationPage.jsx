// Fichier: /client/src/pages/AcceptInvitationPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // On utilise axios directement car l'utilisateur n'est pas encore authentifié

const AcceptInvitationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [invitation, setInvitation] = useState(null);
    const [formData, setFormData] = useState({ name: '', password: '' });

    useEffect(() => {
        if (!token) {
            setError('Invitation token is missing.');
            setLoading(false);
            return;
        }

        const verifyToken = async () => {
            try {
                // IMPORTANT: Utiliser l'URL complète de l'API depuis le .env
                const API_URL = import.meta.env.VITE_API_URL;
                // Note: La route de vérification doit être créée côté backend (GET /api/invitations/:token)
                const { data } = await axios.get(`${API_URL}/invitations/${token}`);
                setInvitation(data);
            } catch (err) {
                setError('This invitation is invalid or has expired.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            // Note: La route d'acceptation doit être créée côté backend (POST /api/invitations/accept)
            await axios.post(`${API_URL}/invitations/accept`, {
                token,
                name: formData.name,
                password: formData.password,
            });
            // Si l'inscription réussit, on redirige vers la page de connexion
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account.');
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Verifying invitation...</div>;

    if (error) return (
        <div className="text-center mt-10 text-red-500">
            <p>{error}</p>
            <Link to="/login" className="text-blue-500">Go to Login</Link>
        </div>
    );
    
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-center">Join Project on Kollab</h1>
                <p className="text-center text-gray-600">You've been invited to join the project: <strong>{invitation?.project?.name}</strong>. Create an account to accept.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-1 text-sm">Your Name</label>
                        <input type="text" name="name" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm">Choose a Password</label>
                        <input type="password" name="password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md disabled:bg-blue-300">
                        {loading ? 'Creating Account...' : 'Accept & Join'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AcceptInvitationPage;