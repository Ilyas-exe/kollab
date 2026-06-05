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
    const totals = { total: 0, sent: 0, paid: 0, draft: 0 };
    const recentInvoicesLocal = [];

    for (const ws of data) {
      try {
        const projectsRes = await apiClient.get(`/workspaces/${ws._id}/projects`);
        const projects = projectsRes.data.projects || [];
        ws.projectCount = projects.length;
        totalProjects += projects.length;

        for (const project of projects) {
          const tasksRes = await apiClient.get(`/projects/${project._id}/tasks`);
          const tasks = tasksRes.data.tasks || [];
          const hasInProgressTasks = tasks.some(task => task.status === 'In Progress');
          if (hasInProgressTasks) {
            activeProjects++;
          }

          try {
            const invRes = await apiClient.get(`/projects/${project._id}/invoices?limit=100`);
            const invData = invRes.data.invoices || [];
            recentInvoicesLocal.push(...invData.map(inv => ({ ...inv, projectName: project.name })));
            for (const inv of invData) {
              totals.total += 1;
              if (inv.status === 'Paid') totals.paid += 1;
              else if (inv.status === 'Draft') totals.draft += 1;
              else totals.sent += 1;
            }
          } catch (err) {
            // ignore invoice fetch errors
          }
        }
      } catch (error) {
        console.error(`Error fetching projects for workspace ${ws._id}:`, error);
        ws.projectCount = 0;
      }

      ws.members?.forEach(member => uniqueMembers.add(member._id || member));
    }

    setStats({ totalProjects, activeProjects, totalMembers: uniqueMembers.size });
    setInvoiceStats({ total: totals.total, sent: totals.sent, paid: totals.paid, draft: totals.draft });
    recentInvoicesLocal.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setRecentInvoices(recentInvoicesLocal.slice(0, 6));
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

  const totalRevenue = recentInvoices.reduce((s, inv) => s + (Number(inv.totalAmount) || 0), 0);
  const paidRatio = invoiceStats.total ? Math.round((invoiceStats.paid / invoiceStats.total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
            Welcome back, {user?.name || 'Client'}
          </h1>
          <p className="text-sm text-muted mt-1">Here's what's happening with your workspaces today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Workspace
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Workspaces — Active (blue) */}
        <div className="card-kpi-active">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Total Workspaces</p>
              <p className="kpi-value">{workspaces.length}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-0.5 text-xs font-semibold bg-white/20 text-white px-1.5 py-0.5 rounded-md">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  Active
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

        {/* Active Projects */}
        <div className="card-kpi">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Active Projects</p>
              <p className="kpi-value">{stats.activeProjects}</p>
              <p className="kpi-subtitle">of {stats.totalProjects} total</p>
            </div>
            <div className="kpi-icon kpi-icon-green">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="card-kpi">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Team Members</p>
              <p className="kpi-value">{stats.totalMembers}</p>
              <p className="kpi-subtitle">Across workspaces</p>
            </div>
            <div className="kpi-icon kpi-icon-purple">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="card-kpi">
          <div className="flex items-center justify-between">
            <div>
              <p className="kpi-label">Total Revenue</p>
              <p className="kpi-value">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="kpi-subtitle">{invoiceStats.paid} invoices paid</p>
            </div>
            <div className="kpi-icon kpi-icon-orange">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoices Trend */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-ink">Performance Overview</h3>
              <p className="text-xs text-muted mt-0.5">Invoice revenue over the last 6 months</p>
            </div>
            <span className="badge text-xs">Last 6 months</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-ink">${invoiceTrend.reduce((s, n) => s + n, 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-muted">Total invoiced</p>
            </div>
            <div className="flex-1 max-w-xs">
              <ChartSparkline data={invoiceTrend} color="#4f6ef7" />
            </div>
          </div>
        </div>

        {/* Paid Ratio */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-ink">Paid Ratio</h3>
            <button className="text-muted hover:text-ink">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-ink">{paidRatio}%</p>
              <p className="text-xs text-muted mt-1">of invoices paid</p>
              <div className="flex items-center gap-3 mt-3 text-xs text-muted">
                <span><span className="font-semibold text-ink">{invoiceStats.paid}</span> paid</span>
                <span><span className="font-semibold text-ink">{invoiceStats.sent}</span> sent</span>
                <span><span className="font-semibold text-ink">{invoiceStats.draft}</span> draft</span>
              </div>
            </div>
            <ChartDonut value={paidRatio} />
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      {recentInvoices.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-line">
            <h3 className="text-base font-semibold text-ink">Recent Invoices</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search invoices..." className="input pl-9 py-2 text-xs w-48" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {recentInvoices.map(inv => (
                  <tr key={inv._id} className="hover:bg-pastel-blue/40 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-semibold text-ink">{inv.invoiceNumber || '—'}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-muted">{inv.projectName}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm text-muted">{new Date(inv.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inv.status === 'Draft'
                          ? 'bg-gray-50 text-gray-600 border border-gray-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-semibold text-ink">${inv.totalAmount?.toFixed?.(2) ?? inv.totalAmount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Revenue by Client */}
      {revenueByClient.length > 0 && (
        <div className="card p-6">
          <h3 className="text-base font-semibold text-ink mb-4">Revenue by Client</h3>
          <MiniBar items={revenueByClient} />
        </div>
      )}

      {/* Workspaces Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-ink">Your Workspaces</h2>
          <span className="text-xs text-muted">{workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaces.length > 0 ? workspaces.map((ws, i) => (
            <div key={ws._id} className="card-interactive p-6 animate-fade-in-up" style={{ animationDelay: `${i * 75}ms` }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${['#4f6ef7', '#34d399', '#fb923c', '#ec4899', '#7c3aed'][i % 5]} 0%, ${['#3451db', '#059669', '#ea580c', '#db2777', '#6d28d9'][i % 5]} 100%)` }}>
                  {ws.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(ws)} className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-gray-100 transition-all" title="Edit">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDeleteWorkspace(ws)} className="p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 transition-all" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-ink mb-1">{ws.name}</h3>
              <p className="text-sm text-muted mb-5">{ws.projectCount || 0} {ws.projectCount === 1 ? 'project' : 'projects'}</p>
              <Link to={`/workspaces/${ws._id}`} className="btn btn-primary w-full text-sm">
                Open Workspace
              </Link>
            </div>
          )) : (
            <div className="col-span-full empty-state border border-dashed border-line rounded-2xl">
              <div className="empty-state-icon">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-2">No workspaces yet</h3>
              <p className="text-sm text-muted mb-6 max-w-sm">Create your first workspace to start organizing your projects and collaborating with your team.</p>
              <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Workspace
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => { setShowCreateModal(false); setNewWorkspaceName(''); }}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-line">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Create New Workspace</h2>
                <button
                  onClick={() => { setShowCreateModal(false); setNewWorkspaceName(''); }}
                  className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateWorkspace}>
              <div className="px-6 py-5">
                <label className="label mb-2 block">Workspace Name</label>
                <input
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g., Marketing Team, Dev Projects..."
                  className="input"
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-line">
                <button type="button" onClick={() => { setShowCreateModal(false); setNewWorkspaceName(''); }} className="btn text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-sm">
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Workspace Modal */}
      {editingWorkspace && (
        <div className="modal-overlay" onClick={() => { setEditingWorkspace(null); setEditName(''); }}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-line">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Edit Workspace</h2>
                <button
                  onClick={() => { setEditingWorkspace(null); setEditName(''); }}
                  className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleUpdateWorkspace}>
              <div className="px-6 py-5">
                <label className="label mb-2 block">Workspace Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter workspace name..."
                  className="input"
                  autoFocus
                />
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-line">
                <button type="button" onClick={() => { setEditingWorkspace(null); setEditName(''); }} className="btn text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-sm">
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