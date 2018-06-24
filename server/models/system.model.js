const mongoose = require('mongoose');

const SystemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
    required: true
  },
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entity',
  }],
  status: {
    required: true,
    type: String,
    default: 'draft',
    enum: ['draft', 'reviewed', 'needs review', 'active', 'pending approval', 'approved', 'rejected']
  },
  iff: {
    type: String,
    enum: ['foe', 'friend', 'neutral'],
    default: 'foe'
  },
  icon: String,
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
