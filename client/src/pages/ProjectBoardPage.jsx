// Fichier: /client/src/pages/ProjectBoardPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import InviteFreelancerModal from '../components/InviteFreelancerModal'; // AJOUTÉ

const ProjectBoardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
    const { apiClient } = useAuth();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // AJOUTÉ

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get(`/projects/${projectId}/tasks`);
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [projectId, apiClient]);

    const handleTaskCreated = (newTask) => {
        setTasks(currentTasks => [...currentTasks, newTask]);
    };

    const handleDragEnd = async (result) => {
        // ... (aucune modification dans cette fonction)
        const { destination, source, draggableId } = result;
        if (!destination) { return; }
        if (destination.droppableId === source.droppableId && destination.index === source.index) { return; }
        const newStatus = destination.droppableId;
        const originalTasks = tasks;
        setTasks(prevTasks => prevTasks.map(t => t._id === draggableId ? { ...t, status: newStatus } : t));
        try {
            await apiClient.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task status', error);
            setTasks(originalTasks); // Revert on error
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Kanban Board</h1>
                {/* AJOUTÉ: un conteneur pour les boutons */}
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsInviteModalOpen(true)} // AJOUTÉ
                        className="bg-blue-500 text-white px-4 py-2 rounded" // AJOUTÉ
                    >
                        + Invite Freelancer
                    </button>
                    <button 
                        onClick={() => setIsTaskModalOpen(true)}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        + New Task
                    </button>
                </div>
            </div>
            
            <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} />

            {isTaskModalOpen && (
                <CreateTaskModal 
                    projectId={projectId}
                    onClose={() => setIsTaskModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}

            {/* AJOUTÉ: Le rendu conditionnel du nouveau modal */}
            {isInviteModalOpen && (
                <InviteFreelancerModal 
                    projectId={projectId}
                    onClose={() => setIsInviteModalOpen(false)}
                />
            )}
        </div>
    );
};

export default ProjectBoardPage;