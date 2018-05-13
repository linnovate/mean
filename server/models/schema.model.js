const mongoose = require('mongoose');
const crypto = require('crypto');

const SchemaSchema = new mongoose.Schema({
  map: {
    type: String,
    unique: true
  },
  label: String,
  fields: Array
}, {
  versionKey: false
});

module.exports = mongoose.model('Schema', SchemaSchema);
