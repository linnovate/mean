const EntityData = require('../models/entity-data.model');

module.exports = {
  insert,
  update,
//   remove,
  get,
//   list
}

async function insert(userId, schemaId, entityData) {
  return await new EntityData({
      _schema: schemaId,
      user: userId,
      data: entityData
  }).save();
}

async function update(entityDataId, entityData) {
  return await EntityData.findByIdAndUpdate(entityDataId, entityData);
}

async function get(entityDataId) {
  return await EntityData.findById(entityDataId);
}

// async function list() {
//   return await Schema.find();
// }
