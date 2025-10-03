// client/src/components/CreateProjectModal.jsx
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import axios from 'axios';

// We receive two functions as props:
// `onClose` to close the modal
// `onProjectCreated` to refresh the project list
function CreateProjectModal({ workspaceId, onClose, onProjectCreated }) {
  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState('');
  const { apiClient } = useAuth();

  // We will add the API call logic here later
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName) {
      setError('Project name is required');
      return;
    }
    
    try {
      
      // Use the apiClient which already has the token configured
      const { data } = await apiClient.post(
        '/projects',
        { name: projectName, workspaceId }
      );
      

      onProjectCreated(data); // Pass the new project data back
      onClose(); // Close the modal
    } catch (err) {
      setError('Failed to create project. Please try again.');
      console.error(err);
    }
  };

 return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="text-2xl font-bold mb-4 text-white">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="projectName" className="block text-left text-gray-300 mb-2">Project Name</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., New Website for Client X"
              className="w-full p-2 border rounded bg-gray-700 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateProjectModal;