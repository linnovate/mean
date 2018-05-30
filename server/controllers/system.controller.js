const System = require('../models/system.model');

module.exports = {
  insert,
  update,
  get,
  list,
  remove
}

async function insert(userId, data) {
  return await new System({platform: data.platform, user: userId, equipment: data.equipment}).save();
}

async function update(id, data) {
  return await System.findByIdAndUpdate(id, {
    $set: {
      equipment: data.equipment,
      updtaed: new Date()
    }
  }, {new: true});
}

async function get(id) {
  return await System.findById(id);
}

async function list(userId) {
  return await System.find({user: userId}).populate('platform').populate('equipment');
}

async function remove(id) {
  return await System.deleteById(id);
}
