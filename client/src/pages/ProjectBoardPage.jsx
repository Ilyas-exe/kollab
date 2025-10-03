import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';

const ProjectBoardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const { apiClient } = useAuth();

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

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Kanban Board</h1>
      {/* We pass the real tasks to the KanbanBoard now */}
      <KanbanBoard tasks={tasks} />
    </div>
  );
};

export default ProjectBoardPage;