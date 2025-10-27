// src/components/DashboardFreelancerView.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardFreelancerView = () => {
  const [projects, setProjects] = useState([]);
  const { apiClient } = useAuth();

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const { data } = await apiClient.get('/projects/my-projects');
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch assigned projects", error);
      }
    };
    fetchAssignedProjects();
  }, [apiClient]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-6">Assigned Projects</h1>

      <div className="space-y-4">
        {projects.length > 0 ? (
          projects.map(project => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id} 
              className="block p-6 bg-surface rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors"
            >
              <h3 className="font-bold text-xl text-text-primary">{project.name}</h3>
              <p className="text-sm text-text-secondary mt-1">
                Workspace: {project.workspaceId.name}
              </p>
            </Link>
          ))
        ) : (
          <div className="text-center py-10 px-6 bg-surface rounded-lg border border-gray-200">
            <p className="text-text-secondary">You haven't been assigned to any projects yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFreelancerView;