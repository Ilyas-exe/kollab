import express from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController.js';
import { getProjectsForWorkspace } from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);

router.route('/:workspaceId/projects').get(protect, getProjectsForWorkspace);

export default router;