// src/pages/ProjectBoardPage.jsx

import { useEffect, useState } from 'react';
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
    const [activeTab, setActiveTab] = useState(initialTab); // 'board' or 'invoices'
    const { projectId } = useParams();
    const { apiClient, user } = useAuth();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const fetchProjectData = async () => {
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
    };

    useEffect(() => {
        fetchProjectData();
    }, [projectId]);

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

        // Optimistic update
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
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-text-secondary">Loading project board...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-text-secondary">Project not found</p>
                </div>
            </div>
        );
    }

    const isClient = user?.role === 'Client';
    const taskStats = {
        todo: tasks.filter(t => t.status === 'To Do').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        done: tasks.filter(t => t.status === 'Done').length,
        total: tasks.length
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Project Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {/* Back Button */}
                            <Link 
                                to={`/workspaces/${project.workspaceId}`}
                                className="text-text-secondary hover:text-primary transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h1 className="text-2xl font-bold text-text-primary">{project.name}</h1>
                                    <span className="px-3 py-1 bg-primary bg-opacity-10 text-primary text-xs font-semibold rounded-full">
                                        {taskStats.total} {taskStats.total === 1 ? 'Task' : 'Tasks'}
                                    </span>
                                </div>
                                {project.description && (
                                    <p className="text-text-secondary text-sm mt-1">{project.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Team Members Avatar Group */}
                            <div className="flex items-center -space-x-2">
                                {project.members?.slice(0, 5).map((member, idx) => (
                                    <div 
                                        key={member._id}
                                        className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold border-2 border-white shadow-sm"
                                        title={member.name}
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                                {project.members?.length > 5 && (
                                    <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-semibold border-2 border-white shadow-sm">
                                        +{project.members.length - 5}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-text-primary bg-white rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>Chat</span>
                            </button>

                            {isClient && (
                                <button
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-text-primary bg-white rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span>Invite</span>
                                </button>
                            )}
                            
                            <button
                                onClick={() => setIsTaskModalOpen(true)}
                                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-sm"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>New Task</span>
                            </button>
                        </div>
                    </div>

                    {/* Task Statistics */}
                    <div className="flex items-center space-x-6 mt-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">{taskStats.todo}</span> To Do
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">{taskStats.inProgress}</span> In Progress
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-text-secondary">
                                <span className="font-semibold text-text-primary">{taskStats.done}</span> Done
                            </span>
                        </div>
                        <div className="h-4 w-px bg-gray-300"></div>
                        <div className="text-sm text-text-secondary">
                            Progress: <span className="font-semibold text-text-primary">
                                {taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('board')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'board'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                </svg>
                                <span>Board</span>
                                <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                    {taskStats.total}
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('invoices')}
                            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === 'invoices'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center space-x-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Invoices</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-6">
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