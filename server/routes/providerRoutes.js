const express = require('express');
const {
  listProviders,
  getMyProviderProfile,
  updateMyProviderProfile,
  submitMyKyc,
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
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listProviders);
router.use('/me', protect, authorize('service_provider'));
router.get('/me', getMyProviderProfile);
router.put('/me', updateMyProviderProfile);
router.post('/me/kyc', submitMyKyc);
router.get('/me/services', listMyServices);
router.post('/me/services', createService);
router.patch('/me/services/:id', updateMyService);
router.get('/me/analytics', getBusinessAnalytics);
router.get('/me/requests', listAssignedRequests);
router.get('/me/open-requests', listOpenRequests);
router.get('/me/reviews', listMyReviews);
router.patch('/me/open-requests/:id/claim', claimRequest);
router.patch('/me/requests/:id/status', updateAssignedRequestStatus);
router.patch('/me/requests/:id/pipeline', updateLeadPipeline);
router.post('/me/requests/:id/quote', sendQuote);

module.exports = router;
