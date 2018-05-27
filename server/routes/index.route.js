const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const schemaRoutes = require('./schema.route');
const entityDataRoutes = require('./entity.route');
const loadedPlatformRoutes = require('./loaded-platform.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/schema', schemaRoutes);
router.use('/entity', entityDataRoutes);
router.use('/loaded-platform', loadedPlatformRoutes);

module.exports = router;
