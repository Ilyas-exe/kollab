// Fichier: /client/src/components/InviteFreelancerModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const InviteFreelancerModal = ({ projectId, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(''); // Pour afficher les messages de succès ou d'erreur
    const { apiClient } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage('Please enter an email.');
            return;
        }
        setLoading(true);
        setMessage('');

        try {
            const res = await apiClient.post('/invitations', { email, projectId });
            setMessage('Invitation sent successfully!');
            console.log("Pour tester, utilise ce lien :", res.data.invitationLink);
            // On peut fermer le modal après un court délai
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to send invitation.');
            console.error("Invitation error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Invite a Freelancer</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Freelancer's Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-blue-500 text-white disabled:bg-blue-300">
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-sm text-center">{message}</p>}
            </div>
        </div>
    );
};

export default InviteFreelancerModal;