import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function CreateTaskModal({ projectId, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const { apiClient } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Task title is required');
      return;
    }
    
    try {
      const { data } = await apiClient.post('/tasks', {
        title,
        projectId,
      });

      onTaskCreated(data); // Pass the newly created task back to the board page
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="text-2xl font-bold mb-4 text-white">Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="taskTitle" className="block text-left text-gray-300 mb-2">Task Title</label>
            <input
              type="text"
              id="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Design the login button"
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTaskModal;