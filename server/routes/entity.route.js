const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const entityCtrl = require('../controllers/entity.controller');
const systemCtrl = require('../controllers/system.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/')
  .post(asyncHandler(insert));

router.route('/clone/:entityId')
  .get(asyncHandler(findOne), asyncHandler(cloneEntity));

router.route('/clone/:entityId/:modeName')
  .get(asyncHandler(findOne), asyncHandler(checkUniqueMode), asyncHandler(cloneMode));

router.route('/:entityId/:modeName?')
  .get(asyncHandler(get))
  .put(asyncHandler(findOne), asyncHandler(checkUniqueMode), asyncHandler(update))
  .delete(asyncHandler(validateRemove), asyncHandler(remove));

async function insert(req, res) {
  let entityData = await entityCtrl.insert(req.user, req.body);
  res.json(entityData);
}

async function get(req, res) {
  let entityData = await entityCtrl.get(req.params.entityId, req.params.modeName);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function findOne(req, res, next) {
  let entityData = await entityCtrl.findById(req.params.entityId);
  if(!entityData) throw new httpError(404);
  req.entity = entityData;
  next();
}

async function checkUniqueMode(req, res, next) {
  let uniqueMode = await entityCtrl.checkUniqueMode(req.entity, req.body, req.params);
  if (!uniqueMode) throw new httpError(403);
  next();
}

async function update(req, res) {
  let entityData = await entityCtrl.update(req.params.entityId, req.params.modeName, req.body);
  if(!entityData) throw new httpError(404);
  res.json(entityData);
}

async function cloneEntity(req, res) {
  let clonedEntity = await entityCtrl.clone(req.entity);
  if (!clonedEntity) throw new httpError(404);
  res.json(clonedEntity);
}

async function cloneMode(req, res) {
  let clonedEntity = await entityCtrl.cloneMode(req.params.entityId, req.params.modeName);
  if (!clonedEntity) throw new httpError(404);
  res.json(clonedEntity);
}

async function remove(req, res) {
  let entity = await entityCtrl.remove(req.params.entityId, req.params.modeName);
  if(!entity) throw new httpError(404);
  res.json(entity);
}

async function validateRemove(req, res, next) {
  let systems = await systemCtrl.findEntity(req.params.entityId);
  if(systems && systems.length) throw new httpError(403, `This entity exists in ${systems[0].name} system.`);
  next();
}