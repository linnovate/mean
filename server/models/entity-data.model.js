const mongoose = require('mongoose');

const EntityDataSchema = new mongoose.Schema({
  _schema: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schema',
    required: true
  },
  data: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  versionKey: false
});

module.exports = mongoose.model('EntityData', EntityDataSchema);
