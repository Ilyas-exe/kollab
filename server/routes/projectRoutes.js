import express from 'express';
const router = express.Router();
import { createProject , getMyAssignedProjects, getProjectById} from'../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; 
import { getTasksForProject } from '../controllers/taskController.js';
import { getInvoicesForProject } from'../controllers/invoiceController.js';
import { getMessagesForProject } from '../controllers/messageController.js';

// Route to create a project
router.route('/').post(protect, createProject);
router.get('/my-projects', protect, getMyAssignedProjects);
router.route('/:id').get(protect, getProjectById);
router.route('/:projectId/tasks').get(protect, getTasksForProject);
router.route('/:projectId/invoices').get(protect, getInvoicesForProject);
router.route('/:projectId/messages').get(protect, getMessagesForProject);

export default router;