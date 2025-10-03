// client/src/pages/WorkspaceDetailPage.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal'; // <-- IMPORT THIS

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
    // Add the new project to our list without needing a full refresh
    setProjects(currentProjects => [...currentProjects, newProject]);
    fetchProjects(); // Or just refetch all projects
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-8"
      >
        + Create New Project
      </button>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <div key={project._id} className="p-4 bg-white rounded shadow">
              <h3 className="font-bold text-gray-800">{project.name}</h3>
            </div>
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