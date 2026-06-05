// src/pages/ProjectBoardPage.jsx

import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import InviteFreelancerModal from '../components/InviteFreelancerModal';
import ChatWindow from '../components/ChatWindow';
import InvoiceList from '../components/InvoiceList';

const ProjectBoardPage = ({ initialTab = 'board' }) => {
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(initialTab);
    const { projectId } = useParams();
    const { apiClient, user } = useAuth();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const isClient = user?.role === 'Client';

    const fetchProjectData = useCallback(async () => {
        try {
            setLoading(true);
            const [projectRes, tasksRes] = await Promise.all([
                apiClient.get(`/projects/${projectId}`),
                apiClient.get(`/projects/${projectId}/tasks`)
            ]);
            
            setProject(projectRes.data);
            setTasks(tasksRes.data.tasks || []);
        } catch (error) {
            console.error("Failed to fetch project data", error);
        } finally {
            setLoading(false);
        }
    }, [apiClient, projectId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const handleTaskCreated = (newTask) => {
        setTasks(prev => [newTask, ...prev]);
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newStatus = destination.droppableId;
        const originalTasks = [...tasks];

        setTasks(prevTasks =>
            prevTasks.map(t =>
                t._id === draggableId ? { ...t, status: newStatus } : t
            )
        );

        try {
            await apiClient.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task status', error);
            setTasks(originalTasks);
        }
    };

    const handleDeleteTask = (taskId) => {
        setTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
    };

    const handleUpdateTask = (updatedTask) => {
        setTasks(prevTasks =>
            prevTasks.map(t => t._id === updatedTask._id ? updatedTask : t)
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="inline-block animate-spin h-10 w-10 border-2 border-accent border-t-transparent rounded-full" />
                    <p className="mt-4 text-sm text-muted">Loading project board...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <p className="text-muted font-medium">Project not found</p>
                </div>
            </div>
        );
    }

    const taskStats = {
        todo: tasks.filter(t => t.status === 'To Do').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        done: tasks.filter(t => t.status === 'Done').length,
        total: tasks.length
    };

    const backPath = isClient ? `/workspaces/${project.workspaceId}` : '/dashboard';
    const progressPct = taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted">
                <Link to="/dashboard" className="hover:text-ink transition-colors">Dashboard</Link>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-ink font-medium">{project.name}</span>
            </div>

            {/* Project Header */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)' }}>
                            {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                                    {project.name}
                                </h1>
                                <span className="badge-info text-xs">
                                    {taskStats.total} {taskStats.total === 1 ? 'Task' : 'Tasks'}
                                </span>
                            </div>
                            {project.description && (
                                <p className="text-sm text-muted mt-1">{project.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Team Members */}
                        <div className="flex items-center -space-x-2 mr-2">
                            {project.members?.slice(0, 5).map((member) => (
                                <div 
                                    key={member._id}
                                    className="avatar avatar-sm border-2 border-white"
                                    title={member.name}
                                >
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {project.members?.length > 5 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 text-muted flex items-center justify-center text-xs font-bold border-2 border-white">
                                    +{project.members.length - 5}
                                </div>
                            )}
                        </div>

                        {isClient && (
                            <button
                                onClick={() => setIsInviteModalOpen(true)}
                                className="btn text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                Invite
                            </button>
                        )}

                        <button
                            onClick={() => setIsChatOpen(true)}
                            className="btn text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat
                        </button>
                        
                        <button
                            onClick={() => setIsTaskModalOpen(true)}
                            className="btn btn-primary text-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Task
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-line">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                        <span className="text-sm text-muted"><span className="font-semibold text-ink">{taskStats.todo}</span> To Do</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        <span className="text-sm text-muted"><span className="font-semibold text-ink">{taskStats.inProgress}</span> In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-sm text-muted"><span className="font-semibold text-ink">{taskStats.done}</span> Done</span>
                    </div>
                    <div className="h-4 w-px bg-line" />
                    <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                        <span className="text-sm text-muted">Progress</span>
                        <div className="flex-1 max-w-[120px] h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #4f6ef7, #7c3aed)' }} />
                        </div>
                        <span className="text-sm font-semibold text-ink">{progressPct}%</span>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('board')}
                    className={activeTab === 'board' ? 'tab-item-active' : 'tab-item'}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        Board
                        <span className="ml-1 px-1.5 py-0.5 bg-gray-200 text-muted rounded-md text-xs font-bold">
                            {taskStats.total}
                        </span>
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('invoices')}
                    className={activeTab === 'invoices' ? 'tab-item-active' : 'tab-item'}
                >
                    <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Invoices
                    </span>
                </button>
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'board' ? (
                    <KanbanBoard 
                        tasks={tasks} 
                        onDragEnd={handleDragEnd}
                        onDeleteTask={handleDeleteTask}
                        onUpdateTask={handleUpdateTask}
                        members={project.members || []}
                    />
                ) : (
                    <InvoiceList 
                        projectId={projectId}
                        projectName={project.name}
                    />
                )}
            </div>

            {/* Modals */}
            {isTaskModalOpen && (
                <CreateTaskModal
                    projectId={projectId}
                    members={project.members || []}
                    onClose={() => setIsTaskModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}

            {isInviteModalOpen && (
                <InviteFreelancerModal
                    projectId={projectId}
                    onClose={() => setIsInviteModalOpen(false)}
                />
            )}

            {/* Chat Window */}
            <ChatWindow 
                projectId={projectId}
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </div>
    );
};

export default ProjectBoardPage;