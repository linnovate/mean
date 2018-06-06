const express = require('express');
const passport = require('passport');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler');
const schemaCtrl = require('../controllers/schema.controller');
const requireAdmin = require('../middleware/require-admin');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))

router.route('/')
  .get(asyncHandler(list))
  .post(requireAdmin, asyncHandler(insert));

router.route('/tree')
  .get(asyncHandler(tree));

router.route('/upload')
  .post(requireAdmin, asyncHandler(upload));

router.route('/:schemaId')
  .get(asyncHandler(get))
  .put(asyncHandler(update))
  .delete(asyncHandler(remove));


async function list(req, res) {
  let schemaArray = await schemaCtrl.list(req.query);
  res.json(schemaArray);
}

async function tree(req, res) {
  let tree = await schemaCtrl.tree(req.query);
  res.json(tree);
}

async function insert(req, res) {
  let schema = await schemaCtrl.insert(req.body);
  res.json(schema);
}

async function upload(req, res) {
  let schema = await schemaCtrl.upload(req);
  res.json(schema);
}

async function get(req, res) {
  let schema = await schemaCtrl.get(req.params.schemaId);
  if(!schema) throw new httpError(404);
  res.json(schema);
}

async function update(req, res) {
  let schema = await schemaCtrl.update(req.params.schemaId, req.body);
  if(!schema) throw new httpError(404);
  res.json(schema);
}

async function remove(req, res) {
  let schema = await schemaCtrl.remove(req.params.schemaId);
  if(!schema) throw new httpError(404);
  res.json(schema);
}
