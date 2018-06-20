const mongoose = require('mongoose');

const SchemaSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  type: {
    type: String,
    required: true,
    enum: ['platform', 'equipment'],
  },
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

SchemaSchema.path('category').validate(function (value) {
  if (!value) return false;
  return true;
}, 'Category is required');


module.exports = mongoose.model('Schema', SchemaSchema);
