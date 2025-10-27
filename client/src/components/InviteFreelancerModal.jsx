// Fichier: /client/src/components/InviteFreelancerModal.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const InviteFreelancerModal = ({ projectId, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { apiClient } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Please enter an email address.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const res = await apiClient.post('/invitations', { 
                email: email.trim(), 
                projectId 
            });
            
            setSuccess('Invitation sent successfully!');
            console.log("Invitation link:", res.data.invitationLink);
            
            // Close modal after success
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send invitation. Please try again.');
            console.error("Invitation error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-slideUp"
                onClick={(e) => e.stopPropagation()} 
            >
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Invite Freelancer</h2>
                                <p className="text-sm text-text-secondary">Send an invitation to join this project</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={loading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-5 space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="freelancerEmail" className="block text-sm font-semibold text-text-primary mb-2">
                                Freelancer's Email <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                id="freelancerEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="freelancer@example.com"
                                required
                                autoFocus
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-text-primary placeholder-gray-400"
                            />
                            <p className="text-xs text-text-secondary mt-2">
                                The freelancer will receive an email with an invitation link to join this project.
                            </p>
                        </div>

                        {/* Success Message */}
                        {success && (
                            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <svg className="w-5 h-5 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-success font-medium">{success}</p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <svg className="w-5 h-5 text-danger flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-danger font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={loading}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text-secondary bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[150px] justify-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Sending...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>Send Invitation</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InviteFreelancerModal;