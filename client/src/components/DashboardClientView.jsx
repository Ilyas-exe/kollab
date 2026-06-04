import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ChartSparkline from './charts/ChartSparkline';
import ChartDonut from './charts/ChartDonut';
import MiniBar from './charts/MiniBar';
import BarSpark from './charts/BarSpark';

const DashboardClientView = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editName, setEditName] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalMembers: 0
  });
  const [invoiceStats, setInvoiceStats] = useState({ total: 0, sent: 0, paid: 0, draft: 0 });
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [invoiceTrend, setInvoiceTrend] = useState([]);
  const { apiClient, user } = useAuth();

  // derive revenue by client from recentInvoices
  const revenueByClient = (() => {
    if (!recentInvoices || recentInvoices.length === 0) return [];
    const map = {};
    for (const inv of recentInvoices) {
      const key = inv.clientName || inv.client || 'Client';
      map[key] = (map[key] || 0) + (Number(inv.totalAmount) || 0);
    }
    return Object.keys(map).map(k => ({ label: k, value: map[k] })).sort((a, b) => b.value - a.value).slice(0, 5);
  })();

  const fetchWorkspaces = useCallback(async () => {
    const { data } = await apiClient.get('/workspaces');
    setWorkspaces(data);

    // Calculate stats
    let totalProjects = 0;
    let activeProjects = 0;
    const uniqueMembers = new Set();
    // invoice accumulation helpers
    const totals = { total: 0, sent: 0, paid: 0, draft: 0 };
    const recentInvoicesLocal = [];

    for (const ws of data) {
      // Fetch projects for each workspace to get accurate counts
      try {
        const projectsRes = await apiClient.get(`/workspaces/${ws._id}/projects`);
        const projects = projectsRes.data.projects || [];
        ws.projectCount = projects.length; // Store project count in workspace object
        totalProjects += projects.length;

        // Check for active projects (projects with tasks in "In Progress")
        for (const project of projects) {
          const tasksRes = await apiClient.get(`/projects/${project._id}/tasks`);
          const tasks = tasksRes.data.tasks || [];
          const hasInProgressTasks = tasks.some(task => task.status === 'In Progress');
          if (hasInProgressTasks) {
            activeProjects++;
          }

          // Fetch invoices summary per project (limited)
          try {
            const invRes = await apiClient.get(`/projects/${project._id}/invoices?limit=100`);
            const invData = invRes.data.invoices || [];
            // accumulate recent invoices
            recentInvoicesLocal.push(...invData.map(inv => ({ ...inv, projectName: project.name })));
            // count statuses
            for (const inv of invData) {
              totals.total += 1;
              if (inv.status === 'Paid') totals.paid += 1;
              else if (inv.status === 'Draft') totals.draft += 1;
              else totals.sent += 1;
            }
          } catch (err) {
            // ignore invoice fetch errors for now
          }
        }
      } catch (error) {
        console.error(`Error fetching projects for workspace ${ws._id}:`, error);
        ws.projectCount = 0;
      }

      // Count unique members across all workspaces
      ws.members?.forEach(member => uniqueMembers.add(member._id || member));
    }

    setStats({
      totalProjects,
      activeProjects,
      totalMembers: uniqueMembers.size
    });
    // set invoice stats and recent invoices
    setInvoiceStats({ total: totals.total, sent: totals.sent, paid: totals.paid, draft: totals.draft });
    // sort recent invoices by createdAt desc and keep top 6
    recentInvoicesLocal.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setRecentInvoices(recentInvoicesLocal.slice(0, 6));
        // Build invoice trend for last 6 months
        const now = new Date();
        const months = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          return { key: `${d.getFullYear()}-${d.getMonth() + 1}`, label: d.toLocaleString('default', { month: 'short' }) };
        });
        const monthSums = months.map(m => {
          return recentInvoicesLocal
            .filter(inv => {
              const d = new Date(inv.createdAt);
              return `${d.getFullYear()}-${d.getMonth() + 1}` === m.key;
            })
            .reduce((s, inv) => s + (Number(inv.totalAmount) || 0), 0);
        });
        setInvoiceTrend(monthSums);
  }, [apiClient]);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      await apiClient.post('/workspaces', { name: newWorkspaceName });
      setNewWorkspaceName('');
      setShowCreateModal(false);
      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleUpdateWorkspace = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      await apiClient.put(`/workspaces/${editingWorkspace._id}`, { name: editName });
      setEditingWorkspace(null);
      setEditName('');
      fetchWorkspaces();
    } catch (error) {
      console.error('Error updating workspace:', error);
      alert(error.response?.data?.message || 'Failed to update workspace');
    }
  };

  const handleDeleteWorkspace = async (workspace) => {
    if (window.confirm(`Are you sure you want to delete "${workspace.name}"? This will also delete all projects and tasks within it.`)) {
      try {
        await apiClient.delete(`/workspaces/${workspace._id}`);
        fetchWorkspaces();
      } catch (error) {
        console.error('Error deleting workspace:', error);
        alert(error.response?.data?.message || 'Failed to delete workspace');
      }
    }
  };

  const startEdit = (workspace) => {
    setEditingWorkspace(workspace);
    setEditName(workspace.name);
  };

  return (
    <div className="space-y-8">
      <div>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-ink mb-2">
                Welcome back, {user?.name || 'Client'}
              </h1>
              <p className="text-sm text-muted">Manage your workspaces and collaborate with your team</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Workspace</span>
              </span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Total Workspaces</p>
                <p className="text-3xl font-semibold text-ink mt-1">{workspaces.length}</p>
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
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Active Projects</p>
                <p className="text-3xl font-semibold text-ink mt-1">{stats.activeProjects}</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Team Members</p>
                <p className="text-3xl font-semibold text-ink mt-1">{stats.totalMembers}</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Invoices</p>
                <p className="text-3xl font-semibold text-ink mt-1">{invoiceStats.total}</p>
                <p className="text-sm text-muted mt-1">{invoiceStats.paid} paid • {invoiceStats.sent} sent • {invoiceStats.draft} draft</p>
              </div>
              <div className="w-12 h-12 border border-line bg-paper flex items-center justify-center">
                <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l2-2 4 4m0 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-muted mb-3">Invoices (6mo)</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-ink">${invoiceTrend.reduce((s, n) => s + n, 0).toFixed(0)}</p>
                <p className="text-xs text-muted">Total invoiced</p>
              </div>
              <ChartSparkline data={invoiceTrend} color="#ffffff" />
            </div>
          </div>

          <div className="card p-6 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-muted">Paid Ratio</h3>
              <p className="text-2xl font-semibold text-ink">{invoiceStats.total ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0}%</p>
              <p className="text-xs text-muted">of recent invoices</p>
            </div>
            <ChartDonut value={invoiceStats.total ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0} />
          </div>

          <div className="card p-6">
            <h3 className="text-sm font-semibold text-muted mb-3">Recent Activity</h3>
            <div className="text-sm text-muted">
              <p>{workspaces.length} workspaces • {stats.totalProjects} projects • {stats.totalMembers} members</p>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        {recentInvoices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4">Recent Invoices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentInvoices.map(inv => (
                <div key={inv._id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{inv.invoiceNumber || '—'}</p>
                      <p className="text-xs text-muted">{inv.projectName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-ink">${inv.totalAmount?.toFixed?.(2) ?? inv.totalAmount}</p>
                      <p className="text-xs text-muted">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted">
                    <span className={`px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-success/10 text-success' : inv.status === 'Draft' ? 'bg-paper text-muted' : 'bg-accent/10 text-accent'}`}>
                      {inv.status}
                    </span>
                    <a href={`#/invoices/${inv._id}`} className="text-accent hover:underline">View</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspaces Grid */}
        <div>
          <h2 className="text-xl font-semibold text-ink mb-6">Your Workspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.length > 0 ? workspaces.map(ws => (
              <div key={ws._id} className="card p-6">
                <h3 className="font-semibold text-lg text-ink mb-2">{ws.name}</h3>
                <p className="text-sm text-muted mb-4">{ws.projectCount || 0} {ws.projectCount === 1 ? 'project' : 'projects'}</p>
                <Link to={`/workspaces/${ws._id}`} className="btn btn-primary w-full">Open Workspace</Link>
              </div>
            )) : (
              <div className="text-center py-16 px-6 bg-surface border border-line border-dashed col-span-full">
                <div className="w-16 h-16 border border-line bg-paper flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">No workspaces yet</h3>
                <p className="text-sm text-muted mb-6">Create your first workspace to get started with your projects.</p>
                <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create Workspace</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-strong max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-ink">Create New Workspace</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewWorkspaceName('');
                }}
                className="text-muted hover:text-ink transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateWorkspace}>
              <div className="mb-6">
                <label className="label mb-2 block">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g., Marketing Team, Dev Projects..."
                  className="input"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewWorkspaceName('');
                  }}
                  className="btn flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* Revenue by Client */}
        {revenueByClient.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-ink mb-4">Revenue by Client (recent)</h2>
            <div className="card p-6">
              <MiniBar items={revenueByClient} />
            </div>
          </div>
        )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card-strong max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-ink">Edit Workspace</h2>
              <button
                onClick={() => {
                  setEditingWorkspace(null);
                  setEditName('');
                }}
                className="text-muted hover:text-ink transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateWorkspace}>
              <div className="mb-6">
                <label className="label mb-2 block">
                  Workspace Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter workspace name..."
                  className="input"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingWorkspace(null);
                    setEditName('');
                  }}
                  className="btn flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
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

export default DashboardClientView;