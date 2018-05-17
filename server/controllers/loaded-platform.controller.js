const LoadedPlatform = require('../models/loaded-platform.model');

module.exports = {
  insert,
  update,
  get,
  list,
  remove
}

async function insert(userId, data) {
  return await new LoadedPlatform({platform: data.platform, user: userId, equipment: data.equipment}).save();
}

async function update(id, data) {
  return await LoadedPlatform.findByIdAndUpdate(id, {
    $set: {
      equipment: data.equipment
    }
  }, {new: true});
}

async function get(id) {
  return await LoadedPlatform.findById(id);
}

async function list(userId) {
  return await LoadedPlatform.find({user: userId}).populate('platform').populate('equipment');
}

async function remove(id) {
  return await LoadedPlatform.deleteById(id);
}
