const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const blogRoutes = require('./blog.route');
const categoryRoutes = require('./category.route');
const commentRoutes = require('./comment.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);

module.exports = router;
