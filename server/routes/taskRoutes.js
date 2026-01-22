import express from 'express';
const router = express.Router();
import { createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to create a new task
router.route('/').post(protect, createTask);

// Route to update a specific task
router.route('/:taskId')
    .put(protect, updateTask)
    .delete(protect, deleteTask);

export default router;