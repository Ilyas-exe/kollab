require('dotenv').config(); // Pour charger les variables de .env
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Logique de connexion à la base de données
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('SUCCESS: MongoDB Connected successfully!'))
  .catch(err => console.error('FAILED: MongoDB connection error:', err));

// Une route "test" pour vérifier que le serveur répond
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));