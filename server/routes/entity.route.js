const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const entityCtrl = require('../controllers/entity.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/')
  .post(asyncHandler(insert));

router.route('/:entityId/clone')
  .get(asyncHandler(clone))

router.route('/:entityId/:modeName?')
  .get(asyncHandler(get))
  .put(asyncHandler(update))
  .delete(asyncHandler(remove));

async function insert(req, res) {
  let entityData = await entityCtrl.insert(req.user, req.body);
  res.json(entityData);
}

async function get(req, res) {
  let entityData = await entityCtrl.get(req.params.entityId, req.params.modeName);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function update(req, res) {
  let entityData = await entityCtrl.update(req.params.entityId, req.params.modeName, req.body);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function list(req, res) {
  let entities = await entityCtrl.list(req.user._id, req.params.type);
  if(!entities) throw new httpError(404);
  res.json(entities);
}

async function clone(req, res) {
  let clonedEntity = await entityCtrl.clone(req.params.entityId);
  if (!clonedEntity) throw new httpError(404);
  res.json(clonedEntity);
}

async function remove(req, res) {
  let entity = await entityCtrl.remove(req.params.entityId, req.params.modeName);
  if(!entity) throw new httpError(404);
  res.json(entity);
}
