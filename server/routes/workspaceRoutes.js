import express from 'express';
import { createWorkspace, getWorkspaces, updateWorkspace, deleteWorkspace } from '../controllers/workspaceController.js';
import { getProjectsForWorkspace } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);

router.route('/:workspaceId/projects').get(protect, getProjectsForWorkspace);

router.route('/:id')
    .put(protect, updateWorkspace)    
    .delete(protect, deleteWorkspace);

export default router;