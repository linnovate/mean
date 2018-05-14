const mongoose = require('mongoose');

const SchemaSchema = new mongoose.Schema({
  type: {
    type: String,
    unique: true
  },
  label: String,
  fields: Array
}, {
  versionKey: false
});

module.exports = mongoose.model('Schema', SchemaSchema);
