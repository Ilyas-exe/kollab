import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Importation des routes et middlewares
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import invitationRoutes from "./routes/invitationRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'; // <-- AJOUTÉ
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { socketProtect } from "./middleware/socketAuthMiddleware.js";
import Message from "./models/Message.js";
import Project from "./models/Project.js";

// --- 1. Configuration initiale ---
dotenv.config();
const app = express();

// --- CONFIGURATION DU SERVEUR HTTP ET SOCKET.IO ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Stripe webhook needs raw body
app.post('/api/payments/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
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
app.use(cors());
app.use(express.json());

// --- 3. Connexion à la base de données MongoDB ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("SUCCESS: MongoDB Connected successfully!"))
  .catch((err) => console.error("FAILED: MongoDB connection error:", err));

// --- 4. Routes de l'API ---
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Backend is running!" });
});

app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes); // <-- AJOUTÉ

// --- LOGIQUE SOCKET.IO ---
io.use(socketProtect);

io.on("connection", async (socket) => {
  console.log(`User Connected: ${socket.user.name} (${socket.id})`);

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

  socket.on("sendMessage", async (data) => {
    const { projectId, text } = data;
    if (!projectId || !text) return;

    try {
      const message = new Message({
        text,
        sender: socket.user._id,
        project: projectId,
      });
      await message.save();

      const populatedMessage = await Message.findById(message._id).populate(
        "sender",
        "name"
      );
      io.to(projectId).emit("receiveMessage", populatedMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("sendMessageError", {
        message: "Could not send your message.",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.user.name} (${socket.id})`);
  });
});

// --- 5. Middlewares pour la gestion des erreurs ---
app.use(notFound);
app.use(errorHandler);

// --- 6. Démarrage du serveur ---
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));