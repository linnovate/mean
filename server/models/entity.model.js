const mongoose = require('mongoose');



const EntitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  _schema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schema',
    required: true
  },
  icon: {
    type: String,
    default: 'default'
  },
  modes: [{
    name: {
      type: String,
      required: true,
    },
    description: String,
    data: {},
    status: {
      required: true,
      type: String,
      default: 'draft',
      enum: ['draft', 'reviewed', 'needs review', 'active', 'waiting', 'approved', 'rejected']
    },
    created: {
      type: Date,
      default: Date.now
    },
    updated: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  versionKey: false
});

EntitySchema.index({ _schema: 1, name: 1 }, { unique: true });
EntitySchema.index({ 'modes.name': 1, name: 1, _schema: 1 }, { unique: true });
module.exports = mongoose.model('Entity', EntitySchema);