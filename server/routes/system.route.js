const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const systemCtrl = require('../controllers/system.controller');
const entityCtrl = require('../controllers/entity.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', {session: false}))

router
  .route('/')
  .get(asyncHandler(list))
  .post(asyncHandler(insert));

router
  .route('/tree')
  .get(asyncHandler(tree));

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

async function tree(req, res) {
  let tree = await systemCtrl.tree();
  if (!tree) throw new httpError(404);
  let platforms = await entityCtrl.findByIds(tree.map(p => p._id));
  let completeTree = await systemCtrl.updateTreeNames(platforms, tree);
  res.json(completeTree);
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
