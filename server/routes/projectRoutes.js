import express from 'express';
const router = express.Router();
import { createProject } from'../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import { getTasksForProject } from '../controllers/taskController.js';

// Route to create a project
router.route('/').post(protect, createProject);
router.route('/:projectId/tasks').get(protect, getTasksForProject);

export default router;