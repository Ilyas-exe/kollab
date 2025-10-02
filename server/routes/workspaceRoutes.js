import express from 'express';
import { createWorkspace, getWorkspaces } from '../controllers/workspaceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createWorkspace).get(protect, getWorkspaces);

export default router;