const express = require('express');
const { listMyNotifications, markNotificationRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', listMyNotifications);
router.patch('/:id/read', markNotificationRead);

module.exports = router;
