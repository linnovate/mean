const System = require('../models/system.model');

module.exports = {
  insert,
  update,
  get,
  list,
  remove
}

async function insert(userId, system) {
  system.platform = system.platform[0];
  system.user = userId;
  return await new System(system).save();
}

async function update(id, system) {
  system.platform = system.platform[0];
  system.updtaed = new Date();
  return await System.findByIdAndUpdate(id, {
    $set: system
  }, {new: true});
}

async function get(id) {
  return await System.findById(id).populate('platform').populate('equipment');
}

async function list(userId) {
  return await System.find({user: userId}).populate('platform').populate('equipment');
}

async function remove(id) {
  return await System.deleteById(id);
}
