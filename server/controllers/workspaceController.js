// Fichier: /server/controllers/workspaceController.js

import Workspace from '../models/Workspace.js';
import Task from '../models/Task.js';

// @desc    Get workspaces for a logged-in user
// @route   GET /api/workspaces
// @access  Private
const getWorkspaces = async (req, res) => {
    try {
        // Cette logique fonctionne pour tout le monde :
        // Elle trouve tous les workspaces où l'ID de l'utilisateur
        // est présent dans le tableau 'members'.
        const workspaces = await Workspace.find({ members: { $in: [req.user.id] } });
        res.json(workspaces);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new workspace
// @route   POST /api/workspaces
// @access  Private
const createWorkspace = async (req, res) => {
    const { name } = req.body;
    try {
        const workspace = new Workspace({
            name,
            owner: req.user.id,
            // Très important: le créateur est aussi le premier membre
            members: [req.user.id],
        });

        const createdWorkspace = await workspace.save();
        res.status(201).json(createdWorkspace);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a workspace
// @route   PUT /api/workspaces/:id
const updateWorkspace = async (req, res) => {
    const { name } = req.body;
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        // --- SECURITY CHECK (Only owner can update) ---
        if (workspace.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User is not the owner of this workspace' });
        }
        // --- END SECURITY CHECK ---
        workspace.name = name || workspace.name;
        const updatedWorkspace = await workspace.save();
        res.json(updatedWorkspace);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a workspace
// @route   DELETE /api/workspaces/:id
const deleteWorkspace = async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        // --- SECURITY CHECK (Only owner can delete) ---
        if (workspace.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User is not the owner of this workspace' });
        }
        // --- END SECURITY CHECK ---
        
        // Find all projects in the workspace to delete their tasks
        const projects = await Project.find({ workspaceId: workspace._id });
        const projectIds = projects.map(p => p._id);
        
        await Task.deleteMany({ projectId: { $in: projectIds } });
        await Project.deleteMany({ workspaceId: workspace._id });
        await workspace.deleteOne();

        res.json({ message: 'Workspace, its projects, and tasks removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export { getWorkspaces, createWorkspace, updateWorkspace, deleteWorkspace };