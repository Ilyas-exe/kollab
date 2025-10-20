// Fichier: /server/routes/invoiceRoutes.js
import express from 'express';
const router = express.Router();
import { createInvoice, downloadInvoice } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

// Créer une nouvelle facture
router.post('/', protect, createInvoice);

// Télécharger une facture spécifique en PDF
router.get('/:invoiceId/download', protect, downloadInvoice);

router.route('/:invoiceId').put(protect, updateInvoice);

export default router;