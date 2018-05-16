const EntityData = require('../models/entity-data.model');

module.exports = {
  insert,
  update,
  get,
  list
}

async function insert(userId, schemaId, entityData) {
  return await new EntityData({
    _schema: schemaId,
    user: userId,
    data: JSON.stringify(entityData)
  }).save();
}

async function update(entityDataId, entityData) {
  return await EntityData.findByIdAndUpdate(entityDataId, {$set: {data: JSON.stringify(entityData)}}, {new: true});
}

async function get(entityDataId) {
  return await EntityData.findById(entityDataId);
}

async function list(userId, schemaId) {
  return await EntityData.find({
    user: userId,
    _schema: schemaId
  });
}
