// Fichier: /server/routes/notificationRoutes.js
import express from 'express';
import { getNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/mark-read')
  .post(protect, markNotificationsAsRead);

export default router;