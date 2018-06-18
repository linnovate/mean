const System = require('../models/system.model');

module.exports = {
  insert,
  update,
  get,
  list,
  remove,
  tree,
  updateTreeNames,
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

async function tree() {
  let group = {_id: "$platform"};
  group.children = {$push: {name: "$name", _id: "$_id", type: "system"}};
  return await System.aggregate([{
      $group: group
  }]);
}

async function updateTreeNames(platforms, tree) {
  console.log(platforms, tree);
  return await tree.map(category => {
    category.name = platforms.find(e => JSON.stringify(e._id) === JSON.stringify(category._id)).name;
    return category;
  });
}
