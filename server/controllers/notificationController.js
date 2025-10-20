// Fichier: /server/controllers/notificationController.js
import Notification from '../models/Notification.js';

// @desc    Get unread notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  const recipientId = req.user.id;
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  try {
    const count = await Notification.countDocuments({ recipient: recipientId, isRead: false });
    const notifications = await Notification.find({ recipient: recipientId, isRead: false })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * (page - 1));

    res.json({
      notifications,
      page,
      pages: Math.ceil(count / limit),
      totalUnread: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Mark notifications as read
// @route   POST /api/notifications/mark-read
// @access  Private
export const markNotificationsAsRead = async (req, res) => {
  const { notificationIds } = req.body; // Attendez un tableau d'IDs

  try {
    await Notification.updateMany(
      { _id: { $in: notificationIds }, recipient: req.user.id },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};