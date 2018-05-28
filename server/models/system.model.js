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
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('System', SystemSchema);
