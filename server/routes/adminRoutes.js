const express = require('express');
const {
  getDashboard,
  listUsers,
  updateUserStatus,
  approveProvider,
  rejectProvider,
  reviewProviderKyc,
  listProviderProfiles,
  createProviderAccount,
  listServicesAdmin,
  createServiceAdmin,
  moderateService,
  listRequests,
  updateRequestStatus,
  listReviewsAdmin,
  moderateReview,
  listReports,
  updateReport,
  listCategories,
  upsertCategory,
  listAds,
  createAd,
  updateAd,
  deleteAd,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', listUsers);
router.patch('/users/:id/status', updateUserStatus);
router.get('/providers', listProviderProfiles);
router.post('/providers', createProviderAccount);
router.patch('/providers/:id/approve', approveProvider);
router.patch('/providers/:id/reject', rejectProvider);
router.patch('/providers/:id/kyc', reviewProviderKyc);
router.get('/services', listServicesAdmin);
router.post('/services', createServiceAdmin);
router.patch('/services/:id/moderation', moderateService);
router.get('/requests', listRequests);
router.patch('/requests/:id/status', updateRequestStatus);
router.get('/reviews', listReviewsAdmin);
router.patch('/reviews/:id/moderation', moderateReview);
router.get('/reports', listReports);
router.patch('/reports/:id', updateReport);
router.get('/categories', listCategories);
router.post('/categories', upsertCategory);
router.get('/ads', listAds);
router.post('/ads', createAd);
router.patch('/ads/:id', updateAd);
router.delete('/ads/:id', deleteAd);

module.exports = router;
