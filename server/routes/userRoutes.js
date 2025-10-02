// server/routes/userRoutes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// --- Routes Publiques ---
// Ces routes n'ont pas besoin de token d'authentification.

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', registerUser);

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', loginUser);


// --- Routes Protégées ---
// Ces routes nécessitent un token JWT valide.

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, (req, res) => {
  // Si le middleware 'protect' réussit, il attache les données de l'utilisateur
  // à l'objet 'req'. Nous pouvons simplement renvoyer ces données.
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


export default router;