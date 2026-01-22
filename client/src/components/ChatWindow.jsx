// src/components/ChatWindow.jsx
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ projectId, isOpen, onClose }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { token, user, apiClient } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized]);

  // Fetch message history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!projectId || !isOpen) return;
      try {
        setIsLoading(true);
        const { data } = await apiClient.get(`/projects/${projectId}/messages`);
        setMessages(data || []);
      } catch (error) {
        console.error("Failed to fetch message history", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [projectId, isOpen, apiClient]);

  // Socket.IO connection
  useEffect(() => {
    if (!token || !isOpen) return;

    const newSocket = io(import.meta.env.VITE_API_URL.replace('/api', ''), { 
      auth: { token } 
    });
    
    setSocket(newSocket);

    newSocket.on('receiveMessage', (message) => {
      if (message.project === projectId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => newSocket.close();
  }, [token, projectId, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && socket && user) {
      socket.emit('sendMessage', {
        projectId: projectId,
        text: newMessage.trim(),
      });
      setNewMessage('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col transition-all duration-300 ${
      isMinimized ? 'h-14' : 'h-[500px]'
    }`}>
      {/* Header */}
      <div className="px-4 py-3 bg-primary text-white rounded-t-xl flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3 className="font-semibold">Project Chat</h3>
          <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
            {messages.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-text-secondary">Loading messages...</p>
                </div>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isOwnMessage = msg.sender?._id === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      {!isOwnMessage && (
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold">
                            {msg.sender?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="text-xs font-medium text-text-secondary">
                            {msg.sender?.name || 'Unknown'}
                          </span>
                        </div>
                      )}
                      <div className={`px-4 py-2 rounded-2xl ${
                        isOwnMessage 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white text-text-primary rounded-bl-none shadow-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-white text-opacity-70' : 'text-text-secondary'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-text-primary">No messages yet</p>
                <p className="text-xs text-text-secondary mt-1">Start the conversation!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-primary text-white rounded-full hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
