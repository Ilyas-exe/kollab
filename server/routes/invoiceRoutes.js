// Fichier: /server/routes/invoiceRoutes.js
import express from 'express';
const router = express.Router();
import { createInvoice, downloadInvoice, updateInvoice, deleteInvoice } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

// Créer une nouvelle facture
router.post('/', protect, createInvoice);

// Télécharger une facture spécifique en PDF
router.get('/:invoiceId/download', protect, downloadInvoice);

// Update and delete invoice
router.route('/:invoiceId')
    .put(protect, updateInvoice)
    .delete(protect, deleteInvoice);

export default router;