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

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // If dropped outside a column, do nothing
        if (!destination) {
            return;
        }

        // If dropped in the same place, do nothing
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const task = tasks.find(t => t._id === draggableId);
        const newStatus = destination.droppableId;

        // Optimistic UI Update: Update the state immediately for a smooth user experience
        setTasks(prevTasks =>
            prevTasks.map(t =>
                t._id === draggableId ? { ...t, status: newStatus } : t
            )
        );

        // API Call: Update the task in the backend
        try {
            await apiClient.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task status', error);
            // If the API call fails, revert the state to show an error
            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t._id === draggableId ? { ...t, status: source.droppableId } : t
                )
            );
        }
    };

    if (loading) {
        return <div>Loading tasks...</div>;
    }

    return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          + New Task
        </button>
      </div>
      
      <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} />

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