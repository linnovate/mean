const mongoose = require('mongoose');

const SystemSchema = new mongoose.Schema({
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  },
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
}, {
  versionKey: false
});

module.exports = mongoose.model('System', SystemSchema);
