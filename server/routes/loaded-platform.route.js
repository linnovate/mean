const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const loadedPlatformCtrl = require('../controllers/loaded-platform.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', {session: false}))

router
  .route('/')
  .get(asyncHandler(list))
  .post(asyncHandler(insert));

router
  .route('/:id')
  .get(asyncHandler(get))
  .put(asyncHandler(update))
  .delete(asyncHandler(remove))

async function insert(req, res) {
  let loadedPlatform = await loadedPlatformCtrl.insert(req.user._id, req.body);
  res.json(loadedPlatform);
}

async function get(req, res) {
  let loadedPlatform = await loadedPlatformCtrl.get(req.params.id);
  if (!loadedPlatform) 
    throw new httpError(404);
  res.json(loadedPlatform);
}

async function update(req, res) {
  let loadedPlatform = await loadedPlatformCtrl.update(req.params.id, req.body);
  if (!loadedPlatform) 
    throw new httpError(404);
  res.json(loadedPlatform);
}

async function list(req, res) {
  let loadedPlatforms = await loadedPlatformCtrl.list(req.user._id);
  if (!loadedPlatforms) 
    throw new httpError(404);
  res.json(loadedPlatforms);
}

async function remove(req, res) {
  let loadedPlatform = await loadedPlatformCtrl.remove(req.params.id);
  if(!loadedPlatform) throw new httpError(404);
  res.json(loadedPlatform);
}
