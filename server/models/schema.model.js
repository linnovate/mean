const mongoose = require('mongoose');

const SchemaSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  label: String,
  description: {
    type: String
  },
  type: {
    type: String,
    required: true,
    enum: ['platform', 'equipment'],
  },
  modes: Boolean,
  fields: Array,
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

//pre save check the type, if type is platform - modes = true
// else model = false

module.exports = mongoose.model('Schema', SchemaSchema);
