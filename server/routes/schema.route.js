const express = require('express');
const httpError = require('http-errors');
const asyncHandler = require('express-async-handler')
const validate = require('express-validation');
const schemaCtrl = require('../controllers/schema.controller');

const router = express.Router();
module.exports = router;

router.route('/')
  .get(asyncHandler(list))
  .post(asyncHandler(insert));

router.route('/:schemaId')
  .get(asyncHandler(get))
  .put(asyncHandler(update))
  .delete(asyncHandler(remove));

async function list(req, res) {
  let schemaArray = await schemaCtrl.list();
  res.send(schemaArray);
}

async function insert(req, res) {
  let schema = await schemaCtrl.insert(req.body);
  res.send(schema);
}

async function get(req, res) {
  let schema = await schemaCtrl.get(req.params.schemaId);
  if(!schema) throw new httpError(404);
  res.send(schema);
}

async function update(req, res) {
  let schema = await schemaCtrl.update(req.params.schemaId, req.body);
  if(!schema) throw new httpError(404);
  res.send(schema);
}

async function remove(req, res) {
  let schema = await schemaCtrl.remove(req.params.schemaId);
  if(!schema) throw new httpError(404);
  res.send(schema);
}
