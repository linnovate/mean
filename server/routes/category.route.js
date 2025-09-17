const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const categoryCtrl = require('../controllers/category.controller');

const router = express.Router();
module.exports = router;

// Public routes
router.get('/', asyncHandler(categoryCtrl.getAll));
router.get('/slug/:slug', asyncHandler(categoryCtrl.getBySlug));
router.get('/:id', asyncHandler(categoryCtrl.getById));

// Routes requiring authentication (admin only for modifications)
router.use(passport.authenticate('jwt', { session: false }));

router.post('/', asyncHandler(categoryCtrl.create));
router.put('/:id', asyncHandler(categoryCtrl.update));
router.delete('/:id', asyncHandler(categoryCtrl.remove));
router.post('/:id/toggle', asyncHandler(categoryCtrl.toggle));
