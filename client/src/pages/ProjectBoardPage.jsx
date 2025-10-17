// client/src/pages/ProjectBoardPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import CreateTaskModal from '../components/CreateTaskModal';
import InviteFreelancerModal from '../components/InviteFreelancerModal'; // This is for Meryem's phase, but good to have!

const ProjectBoardPage = () => {
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const { projectId } = useParams();
    const { apiClient } = useAuth();
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    // This single function will now fetch everything for the page
    const fetchProjectData = async () => {
        try {
            setLoading(true);
            const projectRes = await apiClient.get(`/projects/${projectId}`);
            const tasksRes = await apiClient.get(`/projects/${projectId}/tasks`);
            setProject(projectRes.data);
            setTasks(tasksRes.data.tasks); // Correctly access the 'tasks' array from the paginated response
        } catch (error) {
            console.error("Failed to fetch project data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectData();
    }, [projectId, apiClient]);

    const handleTaskCreated = (newTask) => {
        // To see the populated assignee name immediately, we need to refetch
        fetchProjectData(); 
    };

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newStatus = destination.droppableId;
        const originalTasks = [...tasks]; // Create a copy to revert to on error

        // Optimistic UI update
        setTasks(prevTasks =>
            prevTasks.map(t =>
                t._id === draggableId ? { ...t, status: newStatus } : t
            )
        );

        try {
            await apiClient.put(`/tasks/${draggableId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update task status', error);
            setTasks(originalTasks); // Revert on error
        }
    };

    if (loading) {
        return <div>Loading board...</div>;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{project ? project.name : 'Kanban Board'}</h1>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
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
                    members={project ? project.members : []} // <-- THE FIX IS HERE
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
        </div>
    );
};

export default ProjectBoardPage;