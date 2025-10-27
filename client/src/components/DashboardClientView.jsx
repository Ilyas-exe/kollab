import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardClientView = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const { apiClient } = useAuth();

  const fetchWorkspaces = async () => {
    const { data } = await apiClient.get('/workspaces');
    setWorkspaces(data);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName) return;
    await apiClient.post('/workspaces', { name: newWorkspaceName });
    setNewWorkspaceName('');
    fetchWorkspaces();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Your Workspaces</h1>
      
      <form onSubmit={handleCreateWorkspace} className="mb-8 p-4 bg-surface rounded-lg shadow-sm border border-gray-200">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Enter a new workspace name..." 
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90">
            Create
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {workspaces.length > 0 ? (
          workspaces.map(ws => (
            <Link 
              to={`/workspaces/${ws._id}`} 
              key={ws._id} 
              className="block p-6 bg-surface rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors"
            >
              <h3 className="font-bold text-xl text-text-primary">{ws.name}</h3>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-surface rounded-lg border border-gray-200">
            <p className="text-text-secondary">You don't have any workspaces yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardClientView;