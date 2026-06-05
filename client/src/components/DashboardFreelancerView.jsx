// src/components/DashboardFreelancerView.jsx

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ChartSparkline from './charts/ChartSparkline';
import ChartDonut from './charts/ChartDonut';

const DashboardFreelancerView = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0
  });
  const [projectProgressList, setProjectProgressList] = useState([]);
  const { apiClient, user } = useAuth();

  useEffect(() => {
    const fetchAssignedProjects = async () => {
      try {
        const { data } = await apiClient.get('/projects/my-projects');
        setProjects(data);

        const totalTasks = data.reduce((sum, project) => sum + (project.tasks?.length || 0), 0);
        const completedTasks = data.reduce((sum, project) => {
          const completed = project.tasks?.filter(task => task.status === 'Done').length || 0;
          return sum + completed;
        }, 0);

        setStats({ totalProjects: data.length, totalTasks, completedTasks });

        const progressList = data.map(project => {
          const tasks = project.tasks || [];
          const completed = tasks.filter(t => t.status === 'Done').length;
          const pct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
          return pct;
        });
        setProjectProgressList(progressList.slice(0, 12));
      } catch (error) {
        console.error("Failed to fetch assigned projects", error);
      }
    };
    fetchAssignedProjects();
  }, [apiClient]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-gray-50 text-gray-600 border border-gray-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Done':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const avgProgress = projectProgressList.length
    ? Math.round(projectProgressList.reduce((s, n) => s + n, 0) / projectProgressList.length)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Welcome, {user?.name || 'Freelancer'}
        </h1>
        <p className="text-sm text-muted mt-1">Here are your assigned projects and tasks.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Projects — Active (blue) */}
        <div className="card-kpi-active">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Active Projects</p>
              <p className="kpi-value">{stats.totalProjects}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-md">
                  Assigned to you
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Tasks */}
        <div className="card-kpi">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Total Tasks</p>
              <p className="kpi-value">{stats.totalTasks}</p>
              <p className="kpi-subtitle">Across all projects</p>
            </div>
            <div className="kpi-icon kpi-icon-orange">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="card-kpi">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Completed</p>
              <p className="kpi-value">{stats.completedTasks}</p>
              <p className="kpi-subtitle">Tasks finished</p>
            </div>
            <div className="kpi-icon kpi-icon-green">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="card-kpi">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="kpi-label">Progress</p>
              <p className="kpi-value">{completionPercentage}%</p>
            </div>
            <div className="kpi-icon kpi-icon-purple">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${completionPercentage}%`, background: 'linear-gradient(90deg, #4f6ef7, #7c3aed)' }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sparkline */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Project Progress</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-ink">{avgProgress}%</p>
              <p className="text-xs text-muted mt-0.5">Avg completion</p>
            </div>
            <ChartSparkline data={projectProgressList} color="#7c3aed" />
          </div>
        </div>

        {/* Donut */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Your Progress</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-ink">{completionPercentage}%</p>
              <p className="text-xs text-muted mt-0.5">Tasks completed</p>
            </div>
            <ChartDonut value={completionPercentage} color="#0ea5a4" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-ink mb-4">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Projects</span>
              <span className="text-sm font-semibold text-ink">{projects.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">Total Tasks</span>
              <span className="text-sm font-semibold text-ink">{stats.totalTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">In Progress</span>
              <span className="text-sm font-semibold text-accent">{stats.totalTasks - stats.completedTasks - projects.reduce((s, p) => s + (p.tasks?.filter(t => t.status === 'To Do').length || 0), 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">To Do</span>
              <span className="text-sm font-semibold text-muted">{projects.reduce((s, p) => s + (p.tasks?.filter(t => t.status === 'To Do').length || 0), 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink">Your Projects</h2>
          <span className="text-xs text-muted">{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
        </div>
        
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => {
              const projectTasks = project.tasks || [];
              const completedCount = projectTasks.filter(task => task.status === 'Done').length;
              const projectProgress = projectTasks.length > 0 
                ? Math.round((completedCount / projectTasks.length) * 100) 
                : 0;

              return (
                <div key={project._id} className="card-interactive p-6 animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${['#4f6ef7', '#34d399', '#fb923c', '#ec4899', '#7c3aed'][i % 5]} 0%, ${['#3451db', '#059669', '#ea580c', '#db2777', '#6d28d9'][i % 5]} 100%)` }}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1 text-muted">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="text-xs font-medium">{projectTasks.length}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-base text-ink mb-1">{project.name}</h3>
                  <p className="text-xs text-muted mb-4">
                    <span className="font-medium text-ink">Workspace:</span> {project.workspaceId?.name || 'N/A'}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-muted">Progress</span>
                      <span className="text-xs font-bold text-ink">{projectProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${projectProgress}%`, background: 'linear-gradient(90deg, #4f6ef7, #7c3aed)' }}
                      />
                    </div>
                  </div>

                  {/* Task Status */}
                  {projectTasks.length > 0 && (
                    <div className="flex items-center gap-3 mb-4 text-xs text-muted">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <span>{projectTasks.filter(t => t.status === 'To Do').length} To Do</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <span>{projectTasks.filter(t => t.status === 'In Progress').length} Active</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>{completedCount} Done</span>
                      </div>
                    </div>
                  )}

                  <Link to={`/projects/${project._id}`} className="btn btn-primary w-full text-sm">
                    View Project
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state border border-dashed border-line rounded-2xl">
            <div className="empty-state-icon">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">No projects assigned yet</h3>
            <p className="text-sm text-muted max-w-sm">You'll see your assigned projects here once a client adds you to their workspace.</p>
          </div>
        )}
      </div>

      {/* Recent Tasks */}
      {projects.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-line">
            <h3 className="text-base font-semibold text-ink">Recent Tasks</h3>
          </div>
          <div className="divide-y divide-line/60">
            {projects.slice(0, 3).flatMap(project => 
              (project.tasks || []).slice(0, 2).map(task => (
                <div key={task._id} className="px-6 py-3.5 hover:bg-pastel-blue/40 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-ink">{task.title}</h4>
                      <p className="text-xs text-muted">{project.name}</p>
                    </div>
                  </div>
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-xs font-semibold text-accent hover:text-accent-deep transition-colors"
                  >
                    View →
                  </Link>
                </div>
              ))
            ).slice(0, 5)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardFreelancerView;