const Notification = require('../models/Notification');

const createNotification = async ({ user, title, message, type = 'system', link }) => {
  if (!user || !title || !message) return null;

  return Notification.create({
    user,
    title,
    message,
    type,
    link,
  });
};

module.exports = createNotification;
