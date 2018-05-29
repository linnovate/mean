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
  modes: [{
    name: String,
    description: String,
    data: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  }],
  status: {
    type: String,
    enum: ['draft', 'reviewed', 'needs review', 'active']
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('Entity', EntitySchema);
