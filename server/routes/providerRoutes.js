const express = require('express');
const {
  listProviders,
  getMyProviderProfile,
  updateMyProviderProfile,
  submitMyKyc,
  listSubscriptionPlans,
  activateMySubscription,
  createService,
  listMyServices,
  updateMyService,
  listAssignedRequests,
  listOpenRequests,
  claimRequest,
  updateAssignedRequestStatus,
  updateLeadPipeline,
  sendQuote,
  getBusinessAnalytics,
  listMyReviews,
} = require('../controllers/providerController');
const { protect, authorize, requireVerifiedEmail } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listProviders);
router.get('/subscription-plans', listSubscriptionPlans);
router.use('/me', protect, authorize('service_provider'));
router.get('/me', getMyProviderProfile);
router.put('/me', requireVerifiedEmail, updateMyProviderProfile);
router.post('/me/kyc', requireVerifiedEmail, submitMyKyc);
router.post('/me/subscription', requireVerifiedEmail, activateMySubscription);
router.get('/me/services', listMyServices);
router.post('/me/services', requireVerifiedEmail, createService);
router.patch('/me/services/:id', requireVerifiedEmail, updateMyService);
router.get('/me/analytics', getBusinessAnalytics);
router.get('/me/requests', listAssignedRequests);
router.get('/me/open-requests', listOpenRequests);
router.get('/me/reviews', listMyReviews);
router.patch('/me/open-requests/:id/claim', requireVerifiedEmail, claimRequest);
router.patch('/me/requests/:id/status', requireVerifiedEmail, updateAssignedRequestStatus);
router.patch('/me/requests/:id/pipeline', updateLeadPipeline);
router.post('/me/requests/:id/quote', requireVerifiedEmail, sendQuote);

module.exports = router;
