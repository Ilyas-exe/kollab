// Fichier: /client/src/components/ChatTester.jsx (Version Finale Corrigée)
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

// Le composant reçoit maintenant le projectId dynamiquement
const ChatTester = ({ projectId }) => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { token, user, apiClient } = useAuth();
    const messagesEndRef = useRef(null);

    // Effet pour scroller vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Effet pour charger l'historique des messages au chargement
    useEffect(() => {
        const fetchHistory = async () => {
            if (!projectId) return;
            try {
                const { data } = await apiClient.get(`/projects/${projectId}/messages`);
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch message history", error);
            }
        };
        fetchHistory();
    }, [projectId, apiClient]);

    // Effet pour la connexion Socket.IO
    useEffect(() => {
        if (!token) return;

        const newSocket = io("http://localhost:5001", { auth: { token } });
        setSocket(newSocket);

        newSocket.on('receiveMessage', (message) => {
            // S'assurer que le message est pour le projet actuel
            if (message.project === projectId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // Nettoyage à la déconnexion
        return () => newSocket.close();
    }, [token, projectId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && user) {
            // On envoie le message au serveur avec l'ID du projet actuel
            socket.emit('sendMessage', {
                projectId: projectId,
                text: newMessage,
            });
            setNewMessage('');
        }
    };

    return (
        <div style={{ border: '2px solid green', padding: '20px', margin: '20px' }}>
            <h2 style={{ fontWeight: 'bold' }}>--- Chat pour le projet ---</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg) => (
                    <p key={msg._id}><strong>{msg.sender?.name}:</strong> {msg.text}</p>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    style={{ border: '1px solid black', padding: '5px', width: '80%' }}
                />
                <button type="submit" style={{ padding: '5px', marginLeft: '10px' }}>Envoyer</button>
            </form>
        </div>
    );
};

export default ChatTester;