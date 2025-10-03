import express from 'express';
const router = express.Router();
import { createProject } from'../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js'; 

// Route to create a project
router.route('/').post(protect, createProject);

export default router;