// src/pages/WorkspaceDetailPage.jsx

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/CreateProjectModal';

const WorkspaceDetailPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { workspaceId } = useParams();
  const { apiClient } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/workspaces/${workspaceId}/projects`);
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  }, [apiClient, workspaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject) => {
    setProjects(prev => [newProject, ...prev]);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      await apiClient.put(`/projects/${editingProject._id}`, { 
        name: editName.trim(), 
        description: editDescription.trim() 
      });
      setEditingProject(null);
      setEditName('');
      setEditDescription('');
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      alert(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.name}"? This will also delete all tasks within it.`)) {
      try {
        await apiClient.delete(`/projects/${project._id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert(error.response?.data?.message || 'Failed to delete project');
      }
    }
  };

  const startEdit = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="inline-block animate-spin h-10 w-10 border-2 border-accent border-t-transparent rounded-full" />
          <p className="mt-4 text-sm text-muted">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-ink font-medium">Projects</span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Projects</h1>
          <p className="text-sm text-muted mt-1">Manage and organize your workspace projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <div key={project._id} className="card-interactive p-6 animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${['#4f6ef7', '#34d399', '#fb923c', '#ec4899', '#7c3aed'][i % 5]} 0%, ${['#3451db', '#059669', '#ea580c', '#db2777', '#6d28d9'][i % 5]} 100%)` }}>
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(project)}
                    className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-gray-100 transition-all"
                    title="Edit project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
                    className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all"
                    title="Delete project"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-base text-ink mb-1">{project.name}</h3>
              
              {project.description && (
                <p className="text-sm text-muted line-clamp-2 mb-4">{project.description}</p>
              )}

              {!project.description && (
                <p className="text-sm text-muted mb-4">{project.members?.length || 0} member{(project.members?.length || 0) !== 1 ? 's' : ''}</p>
              )}
              
              <Link
                to={`/projects/${project._id}`}
                className="btn btn-primary w-full text-sm"
              >
                Open Project
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state border border-dashed border-line rounded-2xl">
          <div className="empty-state-icon">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-ink mb-2">No Projects Yet</h3>
          <p className="text-sm text-muted mb-6 max-w-md">
            Get started by creating your first project. Projects help you organize tasks and collaborate with your team.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Project
          </button>
        </div>
      )}

      {isModalOpen && (
        <CreateProjectModal
          workspaceId={workspaceId}
          onClose={() => setIsModalOpen(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="modal-overlay" onClick={() => setEditingProject(null)}>
          <div className="modal-card max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-line">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pastel-blue flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Edit Project</h2>
                    <p className="text-sm text-muted">Update project details</p>
                  </div>
                </div>
                <button 
                  onClick={() => setEditingProject(null)}
                  className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateProject}>
              <div className="px-6 py-5 space-y-5">
                <div>
                  <label htmlFor="editProjectName" className="block text-sm font-medium text-ink mb-1.5">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="editProjectName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g., Q4 Marketing Campaign"
                    required
                    autoFocus
                    className="input"
                  />
                </div>

                <div>
                  <label htmlFor="editProjectDescription" className="block text-sm font-medium text-ink mb-1.5">
                    Description <span className="text-muted text-xs font-normal">(Optional)</span>
                  </label>
                  <textarea
                    id="editProjectDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Brief description of what this project is about..."
                    rows="3"
                    className="input resize-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-line">
                <button type="button" onClick={() => setEditingProject(null)} className="btn text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetailPage;