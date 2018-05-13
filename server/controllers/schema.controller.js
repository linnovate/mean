const config = require('../config/config');
const Schema = require('../models/schema.model');

module.exports = {
  insert,
  update,
  remove,
  get,
  list
}

async function insert(schema) {
  return await new Schema(schema).save();
}

async function update(schemaId, schema) {
/*  schema = await get(schemaId);
  schema.set(schema);
  return await Schema.save();*/
  return await Schema.findByIdAndUpdate(schemaId, schema);
}

async function remove(schemaId) {
  return await Schema.findByIdAndDelete(schemaId);
}

async function get(schemaId) {
  return await Schema.findById(schemaId);
}

async function list() {
  return await Schema.find();
}
