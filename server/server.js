import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importation des routes et middlewares
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import workspaceRoutes from './routes/workspaceRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// --- 1. Configuration initiale ---
dotenv.config(); // Charge les variables du fichier .env
const app = express();

// Stripe webhook needs raw body, so we add its route before express.json()
app.post('/api/payments/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    // Forward the raw request to your controller logic.
    // This is a common pattern to handle raw bodies for specific routes.
    // We find the webhook handler in the router and call it manually.
    const webhookRoute = paymentRoutes.stack.find(
        (layer) => layer.route && layer.route.path === '/stripe-webhook' && layer.route.methods.post
    );
    if (webhookRoute) {
        webhookRoute.handle(req, res);
    } else {
        res.status(404).send('Webhook handler not found');
    }
});

// --- 2. Middlewares de base ---
app.use(cors()); // Active le Cross-Origin Resource Sharing
app.use(express.json()); // Permet au serveur de comprendre le JSON envoyé par le client

// --- 3. Connexion à la base de données MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('SUCCESS: MongoDB Connected successfully!'))
  .catch(err => console.error('FAILED: MongoDB connection error:', err));

// --- 4. Routes de l'API ---
// Route de test pour vérifier que le serveur est en ligne
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running!' });
});

// Routes pour l'authentification et les utilisateurs
app.use('/api/users', userRoutes);

app.use('/api/projects', projectRoutes);

// Routes pour les espaces de travail
app.use('/api/workspaces', workspaceRoutes);

app.use('/api/tasks', taskRoutes);

app.use('/api/invitations', invitationRoutes);

app.use('/api/invoices', invoiceRoutes);

app.use('/api/payments', paymentRoutes);

// --- 5. Middlewares pour la gestion des erreurs ---
// Ces middlewares doivent être les derniers à être utilisés par l'application
app.use(notFound); // Gère les requêtes vers des routes inexistantes (404)
app.use(errorHandler); // Gère toutes les autres erreurs du serveur (500)

// --- 6. Démarrage du serveur ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));