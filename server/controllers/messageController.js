// Fichier: /server/controllers/messageController.js
import Message from '../models/Message.js';

// @desc    Get all messages for a project
// @route   GET /api/projects/:projectId/messages
// @access  Private
export const getMessagesForProject = async (req, res) => {
  try {
    const messages = await Message.find({ project: req.params.projectId })
      .sort({ createdAt: -1 }) // Les plus récents d'abord
      .limit(50) // On ne charge que les 50 derniers
      .populate('sender', 'name'); // On ajoute le nom de l'expéditeur

    // On inverse le tableau pour que le frontend les affiche dans l'ordre chronologique
    res.json(messages.reverse());
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};