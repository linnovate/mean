const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const commentCtrl = require('../controllers/comment.controller');

const router = express.Router();
module.exports = router;

// Routes requiring authentication
router.use(passport.authenticate('jwt', { session: false }));

// Comment CRUD
router.post('/', asyncHandler(commentCtrl.create));
router.get('/blog/:blogId', asyncHandler(commentCtrl.getByBlog));
router.get('/user/:userId', asyncHandler(commentCtrl.getByUser));
router.get('/pending', asyncHandler(commentCtrl.getPending));
router.get('/:id', asyncHandler(commentCtrl.getById));
router.put('/:id', asyncHandler(commentCtrl.update));
router.delete('/:id', asyncHandler(commentCtrl.remove));

// Comment actions
router.post('/:id/like', asyncHandler(commentCtrl.toggleLike));
router.post('/:id/moderate', asyncHandler(commentCtrl.moderate));
