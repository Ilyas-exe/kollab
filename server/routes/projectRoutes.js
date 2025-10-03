import express from 'express';
const router = express.Router();
import { createProject } from'../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import { getTasksForProject } from '../controllers/taskController.js';
import { getMyAssignedProjects } from'../controllers/projectController.js';

// Route to create a project
router.route('/').post(protect, createProject);
router.route('/:projectId/tasks').get(protect, getTasksForProject);
router.get('/my-projects', protect, getMyAssignedProjects);

export default router;