// src/pages/WorkspaceDetailPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal'; // We'll integrate this next (Task F-07)

const WorkspaceDetailPage = () => {
  const [projects, setProjects] = useState([]);
  const [workspaceName, setWorkspaceName] = useState(''); // State to hold the workspace name
  const [loading, setLoading] = useState(true);
  const { workspaceId } = useParams();
  const { apiClient } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // For Task F-07

  const fetchProjects = async () => {
    try {
      setLoading(true);
      // Fetch projects for this workspace
      const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`);
      setProjects(data.projects || []); // Use the 'projects' array from the paginated response
      // Optional: Fetch workspace details to get the name (if API provides it)
      // const wsRes = await apiClient.get(`/workspaces/${workspaceId}`); // You might need a GET /api/workspaces/:id endpoint
      // setWorkspaceName(wsRes.data.name); 
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId, apiClient]);

  const handleProjectCreated = () => {
    fetchProjects(); // Refetch projects when a new one is created
  };

  if (loading) {
    return <div className="text-center p-10">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {/* We'll try to add workspace name here later if possible */}
        <h1 className="text-3xl font-bold text-text-primary">Projects</h1> 
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:bg-opacity-90"
        >
          + Create New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            // Each project is now a link to its board
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id} 
              className="block p-6 bg-surface rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors"
            >
              <h3 className="font-bold text-xl text-text-primary">{project.name}</h3>
              {/* Optional: Display member count or other details */}
              <p className="text-sm text-text-secondary mt-1">{project.members.length} member(s)</p>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-surface rounded-lg border border-gray-200">
            <p className="text-text-secondary">This workspace has no projects yet. Create one!</p>
          </div>
        )}
      </div>

      {/* The modal integration will be done in the next task (F-07) */}
      {isModalOpen && (
        <CreateProjectModal
          workspaceId={workspaceId}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default WorkspaceDetailPage;