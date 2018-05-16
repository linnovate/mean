const mongoose = require('mongoose');

const LoadedPlatformSchema = new mongoose.Schema({
  platform: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schema',
    required: true
  },
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schema',
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('LoadedPlatform', LoadedPlatformSchema);
