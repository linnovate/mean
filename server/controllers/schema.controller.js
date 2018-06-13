const Schema = require('../models/schema.model');
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;
const entitiesCtrl = require('./entity.controller');

module.exports = {
  insert,
  update,
  remove,
  get,
  list,
  upload,
  tree,
}

async function insert(schema) {
  return await new Schema(schema).save();
}

async function upload(request) {
  return await new Promise(resolve => {
    const form = new IncomingForm();
    let schema;
    form.on('file', (field, file) => schema = JSON.parse(fs.readFileSync(file.path, 'utf8')));
    form.on('end', () => {
      schema.updated = new Date();
      resolve(Schema.findOneAndUpdate({
        category: schema.category
      }, schema, {upsert : true}))
    });
    form.parse(request);
  });
}

async function update(name, schema) {
  schema.updated = new Date();
  return await Schema.findOneAndUpdate({
    name: name
  }, schema);
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
