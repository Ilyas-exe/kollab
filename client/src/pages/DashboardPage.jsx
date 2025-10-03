import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const { apiClient, logout, user } = useAuth();

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Workspaces</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      <form onSubmit={handleCreateWorkspace} className="mb-8 flex gap-2">
        <input 
          type="text" 
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
          placeholder="New Workspace Name" 
          className="p-2 border rounded flex-grow"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create</button>
      </form>

      <div className="space-y-4">
        {workspaces.length > 0 ? (
          workspaces.map(ws => (
            // --- THIS IS THE CHANGE ---
            <Link 
              to={`/workspaces/${ws._id}`} 
              key={ws._id} 
              className="block p-4 bg-white rounded shadow hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-bold text-gray-800">{ws.name}</h3>
            </Link>
            // --- END OF CHANGE ---
          ))
        ) : (
          <p>You don't have any workspaces yet. Create one!</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;