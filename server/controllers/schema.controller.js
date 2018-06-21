const Schema = require('../models/schema.model');
const entitiesCtrl = require('./entity.controller');

const updateOpts = { new: true, runValidators: true };

module.exports = {
  insert,
  update,
  remove,
  get,
  list,
  tree,
  findByUniqueField,
}

async function insert(schema) {
  return await new Schema(schema).save();
}

async function findByUniqueField(field, data) {
  let query = {};
  query[field] = data[field];
  query.type = data.type;
  return await Schema.findOne(query);
}

async function update(category, schema) {
  schema.updated = new Date();
  return await Schema.findOneAndUpdate({
    category: category
  }, schema, updateOpts);
}

async function remove(schemaId) {
  return await Schema.findByIdAndDelete(schemaId);
}

async function get(schemaId) {
  return await Schema.findById(schemaId);
}

async function tree(params) {
  let field = (params.field) ? params.field : 'all';
  let schemas = await Schema.find({type: params.type}, {category: 1}).lean();
  let ids = schemas.map(s => s._id);
  let entities = await entitiesCtrl.tree(ids, field);
  schemas = schemas.map(s => {
    let result = entities.filter(obj => JSON.stringify(obj._id) === JSON.stringify(s._id));
    s.children = (result.length) ? result[0].children : [];
    s.name = s.category;
    return s;
  });

  return schemas;
}

async function list(params) {
  let query = {
    type: params.type
  };
  if (params.category) query.category = params.category;
  return await Schema.find(query);
}