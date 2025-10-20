// Fichier: /server/utils/notificationService.js
import Notification from '../models/Notification.js';

/**
 * Crée une nouvelle notification dans la base de données.
 * @param {string} recipientId - L'ID de l'utilisateur qui recevra la notification.
 * @param {string} text - Le message de la notification.
 * @param {string} link - Le lien sur lequel l'utilisateur sera redirigé en cliquant.
 */
export const createNotification = async (recipientId, text, link) => {
  try {
    if (!recipientId || !text || !link) {
      console.error('Missing required fields for notification');
      return;
    }
    const notification = new Notification({
      recipient: recipientId,
      text,
      link,
    });
    await notification.save();
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};