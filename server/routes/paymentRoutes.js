// server/routes/paymentRoutes.js

import express from 'express';
import { createPaymentIntent, stripeWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/stripe-webhook', stripeWebhook);

export default router;