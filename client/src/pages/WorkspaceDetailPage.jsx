// client/src/pages/WorkspaceDetailPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal';

const WorkspaceDetailPage = () => {
  const [projects, setProjects] = useState([]);
  const { workspaceId } = useParams();
  const { apiClient } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`);
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId, apiClient]);

  // This function will run after the modal successfully creates a project
  const handleProjectCreated = (newProject) => {
    fetchProjects(); // just refetch all projects
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Create New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            // --- THIS IS THE CHANGE ---
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id} 
              className="block p-4 bg-white rounded shadow hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-bold text-gray-800">{project.name}</h3>
            </Link>
            // --- END OF CHANGE ---
          ))
        ) : (
          <p>This workspace has no projects yet. Create one!</p>
        )}
      </div>

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