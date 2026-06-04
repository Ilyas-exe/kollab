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

        // Calculate stats
        const totalTasks = data.reduce((sum, project) => sum + (project.tasks?.length || 0), 0);
        const completedTasks = data.reduce((sum, project) => {
          const completed = project.tasks?.filter(task => task.status === 'Done').length || 0;
          return sum + completed;
        }, 0);

        setStats({
          totalProjects: data.length,
          totalTasks,
          completedTasks
        });

        // Build project progress list for sparklines
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
        return 'border border-line bg-paper text-ink';
      case 'In Progress':
        return 'border border-accent/30 bg-accent/10 text-accent';
      case 'Done':
        return 'border border-success/30 bg-success/10 text-success';
      default:
        return 'border border-line bg-paper text-ink';
    }
  };

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink mb-2">
            Welcome, {user?.name || 'Freelancer'}
          </h1>
          <p className="text-sm text-muted">Here are your assigned projects and tasks</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Active Projects</p>
                <p className="text-3xl font-semibold text-ink mt-1">{stats.totalProjects}</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Total Tasks</p>
                <p className="text-3xl font-semibold text-ink mt-1">{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Completed</p>
                <p className="text-3xl font-semibold text-ink mt-1">{stats.completedTasks}</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Progress</p>
                <p className="text-3xl font-semibold text-ink mt-1">{completionPercentage}%</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="w-full bg-paper border border-line h-2">
              <div
                className="bg-accent h-2 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-muted mb-3">Project Progress (sample)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-ink">{projectProgressList.length ? projectProgressList.reduce((s, n) => s + n, 0) / projectProgressList.length : 0}%</p>
                <p className="text-xs text-muted">avg completion</p>
              </div>
              <ChartSparkline data={projectProgressList} color="#7c3aed" />
            </div>
          </div>

          <div className="card p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-muted">Your Progress</h3>
              <p className="text-2xl font-semibold text-ink">{completionPercentage}%</p>
              <p className="text-xs text-muted">tasks completed</p>
            </div>
            <ChartDonut value={completionPercentage} color="#0ea5a4" />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-muted mb-3">Quick Stats</h3>
            <div className="text-sm text-muted">
              <p>{projects.length} projects • {stats.totalTasks} tasks</p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div>
          <h2 className="text-xl font-semibold text-ink mb-6">Your Projects</h2>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => {
                const projectTasks = project.tasks || [];
                const completedCount = projectTasks.filter(task => task.status === 'Done').length;
                const projectProgress = projectTasks.length > 0 
                  ? Math.round((completedCount / projectTasks.length) * 100) 
                  : 0;

                return (
                  <div key={project._id} className="card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                          <span className="text-ink font-semibold text-sm">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-sm">{projectTasks.length} tasks</span>
                        </div>
                      </div>

                      <h3 className="font-semibold text-lg text-ink mb-2">
                        {project.name}
                      </h3>

                      <p className="text-sm text-muted mb-4">
                        <span className="font-medium text-ink">Workspace:</span> {project.workspaceId?.name || 'N/A'}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-muted uppercase tracking-wide">Progress</span>
                          <span className="text-xs font-semibold text-ink">{projectProgress}%</span>
                        </div>
                        <div className="w-full bg-paper border border-line h-2">
                          <div
                            className="bg-accent h-2 transition-all duration-500"
                            style={{ width: `${projectProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Task Status Breakdown */}
                      {projectTasks.length > 0 && (
                        <div className="flex items-center justify-between text-xs mb-4">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-line"></div>
                            <span className="text-muted">
                              {projectTasks.filter(t => t.status === 'To Do').length} To Do
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-accent"></div>
                            <span className="text-muted">
                              {projectTasks.filter(t => t.status === 'In Progress').length} In Progress
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-success"></div>
                            <span className="text-muted">
                              {completedCount} Done
                            </span>
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/projects/${project._id}`}
                        className="btn btn-primary w-full"
                      >
                        View Project
                      </Link>
                  </div>
                );
              })}
            </div>
          ) : (
              <div className="text-center py-16 px-6 bg-surface border border-line border-dashed">
                <div className="w-16 h-16 border border-line bg-paper flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
                <h3 className="text-lg font-semibold text-ink mb-2">No projects assigned yet</h3>
                <p className="text-sm text-muted">You'll see your assigned projects here once a client adds you to their workspace.</p>
            </div>
          )}
        </div>

        {/* Recent Activity Section (Optional) */}
        {projects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-ink mb-6">Recent Tasks</h2>
            <div className="card overflow-hidden">
              <div className="divide-y divide-line">
                {projects.slice(0, 3).flatMap(project => 
                  (project.tasks || []).slice(0, 2).map(task => (
                    <div key={task._id} className="p-4 hover:bg-paper transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                            {task.status}
                          </div>
                          <div>
                            <h4 className="font-semibold text-ink">{task.title}</h4>
                            <p className="text-sm text-muted">
                              {project.name}
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/projects/${project._id}`}
                          className="text-accent hover:text-ink font-medium text-sm"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))
                ).slice(0, 5)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFreelancerView;