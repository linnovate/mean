const mongoose = require('mongoose');



const EntitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
      required: true
    },
    description: String,
    data: {},
    status: {
      required: true,
      type: String,
      default: 'draft',
      enum: ['draft', 'reviewed', 'needs review', 'active']
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

module.exports = mongoose.model('Entity', EntitySchema);
