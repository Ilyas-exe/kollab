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

  const handleProjectCreated = (newProject) => {
    // Add the new project to the list without refetching
    setProjects(prev => [newProject, ...prev]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-text-secondary">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Projects</h1>
            <p className="text-text-secondary">Manage and organize your workspace projects</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center space-x-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <Link 
              to={`/projects/${project._id}`} 
              key={project._id} 
              className="group block p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-primary hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center group-hover:bg-opacity-20 transition-all">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex items-center space-x-1 text-text-secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-sm font-medium">{project.members?.length || 0}</span>
                </div>
              </div>
              
              <h3 className="font-bold text-xl text-text-primary mb-2 group-hover:text-primary transition-colors">
                {project.name}
              </h3>
              
              {project.description && (
                <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-gray-100">
                <span>View Board</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Projects Yet</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Get started by creating your first project. Projects help you organize tasks and collaborate with your team.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create First Project</span>
          </button>
        </div>
      )}

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