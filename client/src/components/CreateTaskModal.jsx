import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function CreateTaskModal({ projectId, members, onClose, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
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
        assigneeId: assigneeId || null,
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
            <label htmlFor="assignee" className="block text-left text-gray-300 mb-2">Assign To</label>
            <select
              id="assignee"
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 text-white"
            >
              <option value="">Unassigned</option>
              {members && members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
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