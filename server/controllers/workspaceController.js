// Fichier: /server/controllers/workspaceController.js

import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

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

// On s'assure d'exporter les DEUX fonctions correctement
export { getWorkspaces, createWorkspace };