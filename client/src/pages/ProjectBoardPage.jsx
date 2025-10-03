import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';

const ProjectBoardPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
    const { apiClient } = useAuth();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

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

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Kanban Board</h1>
                {/* --- THIS IS THE NEW BUTTON --- */}
                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    + New Task
                </button>
            </div>

            <KanbanBoard tasks={tasks} />


            {isTaskModalOpen && (
                <CreateTaskModal
                    projectId={projectId}
                    onClose={() => setIsTaskModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                />
            )}
        </div>
    );
};

export default ProjectBoardPage;