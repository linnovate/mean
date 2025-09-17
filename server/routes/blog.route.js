const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const blogCtrl = require('../controllers/blog.controller');

const router = express.Router();
module.exports = router;

// Public routes (no authentication required)
router.get('/published', asyncHandler(blogCtrl.getPublished));
router.get('/featured', asyncHandler(blogCtrl.getFeatured));
router.get('/search', asyncHandler(blogCtrl.search));
router.get('/category/:slug', asyncHandler(blogCtrl.getByCategory));
router.get('/tag/:tag', asyncHandler(blogCtrl.getByTag));
router.get('/slug/:slug', asyncHandler(blogCtrl.getBySlug));
router.post('/:id/views', asyncHandler(blogCtrl.incrementViews));
router.get('/', asyncHandler(blogCtrl.getAll));
// Routes requiring authentication
router.use(passport.authenticate('jwt', { session: false }));

// User routes (authenticated users)

router.get('/drafts', asyncHandler(blogCtrl.getDrafts));
router.get('/:id', asyncHandler(blogCtrl.getById));
router.post('/', asyncHandler(blogCtrl.create));
router.put('/:id', asyncHandler(blogCtrl.update));
router.delete('/:id', asyncHandler(blogCtrl.remove));
router.post('/:id/like', asyncHandler(blogCtrl.toggleLike));

// Admin/Author routes
router.get('/scheduled/all', asyncHandler(blogCtrl.getScheduled));
router.post('/:id/publish', asyncHandler(blogCtrl.publish));
router.post('/:id/schedule', asyncHandler(blogCtrl.schedule));
