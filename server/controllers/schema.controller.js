const Schema = require('../models/schema.model');
const fs = require('fs');
const IncomingForm = require('formidable').IncomingForm;

module.exports = {
  insert,
  update,
  remove,
  get,
  list,
  upload
}

async function insert(schema) {
  return await new Schema(schema).save();
}

async function upload(request) {
  return await new Promise(resolve => {
    const form = new IncomingForm();
    let schema;
    form.on('file', (field, file) => schema = JSON.parse(fs.readFileSync(file.path, 'utf8')));
    form.on('end', () => resolve(new Schema(schema).save()));
    form.parse(request);
  });
}

async function update(schemaId, schema) {
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
