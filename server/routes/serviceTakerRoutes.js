const express = require('express');
const {
  createRequest,
  listMyRequests,
  updateMyRequest,
  deleteMyRequest,
  respondToQuote,
  createReview,
  listReviewsForProvider,
  saveProvider,
  unsaveProvider,
  listSavedProviders,
  getRecommendations,
  createReport,
  listMyNotifications,
  markNotificationRead,
  createContactLog,
  listMyContactLogs,
} = require('../controllers/serviceTakerController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('service_taker'));

router.get('/me/requests', listMyRequests);
router.post('/me/requests', createRequest);
router.put('/me/requests/:id', updateMyRequest);
router.delete('/me/requests/:id', deleteMyRequest);
router.patch('/me/requests/:id/quote', respondToQuote);
router.post('/me/reviews', createReview);
router.get('/reviews/:providerId', listReviewsForProvider);
router.get('/me/saved-providers', listSavedProviders);
router.get('/me/recommendations', getRecommendations);
router.post('/me/saved-providers/:providerId', saveProvider);
router.delete('/me/saved-providers/:providerId', unsaveProvider);
router.post('/me/reports', createReport);
router.get('/me/notifications', listMyNotifications);
router.patch('/me/notifications/:id/read', markNotificationRead);
router.get('/me/contact-logs', listMyContactLogs);
router.post('/me/contact-logs', createContactLog);

module.exports = router;
