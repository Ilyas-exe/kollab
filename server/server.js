import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http"; // AJOUTÉ : Pour créer un serveur HTTP
import { Server } from "socket.io";

// Importation des routes et middlewares
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import { socketProtect } from "./middleware/socketAuthMiddleware.js";
import Message from "./models/Message.js";
import Project from "./models/Project.js";

// --- 1. Configuration initiale ---
dotenv.config(); // Charge les variables du fichier .env
const app = express();

// --- CONFIGURATION DU SERVEUR HTTP ET SOCKET.IO ---
const httpServer = createServer(app); // On crée un serveur HTTP à partir de notre app Express
const io = new Server(httpServer, {
  // On attache Socket.IO à ce serveur
  cors: {
    origin: "http://localhost:5173", // On spécifie l'origine exacte de notre client
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
  // ------------------------------------
});

// --- 2. Middlewares de base ---
app.use(cors()); // Active le Cross-Origin Resource Sharing
app.use(express.json()); // Permet au serveur de comprendre le JSON envoyé par le client

// --- 3. Connexion à la base de données MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: MongoDB Connected successfully!"))
  .catch((err) => console.error("FAILED: MongoDB connection error:", err));

// --- 4. Routes de l'API ---
// Route de test pour vérifier que le serveur est en ligne
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running!" });
});

// Routes pour l'authentification et les utilisateurs
app.use("/api/users", userRoutes);

app.use("/api/projects", projectRoutes);

// Routes pour les espaces de travail
app.use("/api/workspaces", workspaceRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/invitations", invitationRoutes);

app.use("/api/invoices", invoiceRoutes);

// --- LOGIQUE SOCKET.IO ---
io.use(socketProtect); // On utilise notre middleware pour protéger toutes les connexions socket

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.user.name} (${socket.id})`);

  // 1. L'utilisateur rejoint une "room" pour chaque projet dont il est membre
  try {
    const projects = await Project.find({
      members: { $in: [socket.user._id] },
    });
    projects.forEach((project) => {
      socket.join(project._id.toString());
      console.log(
        `${socket.user.name} joined room for project: ${project.name}`
      );
    });
  } catch (error) {
    console.error("Error joining project rooms:", error);
  }

  // Écouter les nouveaux messages
  socket.on("sendMessage", async (data) => {
    const { projectId, text } = data;
    if (!projectId || !text) return; // Sécurité ajoutée

    try {
      // ÉTAPE 1: Sauvegarder le message
      const message = new Message({
        text,
        sender: socket.user._id,
        project: projectId,
      });
      await message.save();

      // ÉTAPE 2: Récupérer le message complet avec les détails de l'expéditeur
      const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name"
      );

      // --- LA CORRECTION FINALE ET DÉFINITIVE EST ICI ---
      // On diffuse le message à TOUS les membres de la room du projet.
      io.to(projectId).emit("receiveMessage", populatedMessage);
      // ----------------------------------------------------
    } catch (error) {
      console.error("Error sending message:", error);
      // Envoyer une notification d'erreur uniquement à l'expéditeur
      socket.emit("sendMessageError", {
        message: "Could not send your message.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.user.name} (${socket.id})`);
  });
});
// ----------------------------------------------------

// --- 5. Middlewares pour la gestion des erreurs ---
// Ces middlewares doivent être les derniers à être utilisés par l'application
app.use(notFound); // Gère les requêtes vers des routes inexistantes (404)
app.use(errorHandler); // Gère toutes les autres erreurs du serveur (500)

// --- 6. Démarrage du serveur ---
const PORT = process.env.PORT || 5001;
// Remplacer cette ligne :
// app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

// Par celle-ci :
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
