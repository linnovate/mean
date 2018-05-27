const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const systemCtrl = require('../controllers/system.controller');
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
  let system = await systemCtrl.insert(req.user._id, req.body);
  res.json(system);
}

async function get(req, res) {
  let system = await systemCtrl.get(req.params.id);
  if (!system) 
    throw new httpError(404);
  res.json(system);
}

async function update(req, res) {
  let system = await systemCtrl.update(req.params.id, req.body);
  if (!system) 
    throw new httpError(404);
  res.json(system);
}

async function list(req, res) {
  let systems = await systemCtrl.list(req.user._id);
  if (!systems) 
    throw new httpError(404);
  res.json(systems);
}

async function remove(req, res) {
  let system = await systemCtrl.remove(req.params.id);
  if(!system) throw new httpError(404);
  res.json(system);
}
