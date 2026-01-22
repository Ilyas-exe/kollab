// Fichier: /server/routes/invitationRoutes.js
import express from 'express';
const router = express.Router();

// On importe les fonctions spécifiques dont on a besoin entre accolades {}
import {
  createInvitation,
  verifyInvitation,
  acceptInvitation
} from '../controllers/invitationController.js';

import { protect } from '../middleware/authMiddleware.js';

// Créer une invitation (protégé)
router.post('/', protect, createInvitation);

// Vérifier un token (public)
router.get('/:token', verifyInvitation);

// Accepter une invitation (public)
router.post('/accept', acceptInvitation);

export default router;