const Entity = require('../models/entity.model');

module.exports = {
  insert,
  update,
  get,
  list
}

async function insert(userId, schemaId, entity) {
  return await new Entity({
    _schema: schemaId,
    user: userId,
    name: entity.name,
    description: entity.description,
    modes: [{
      data: JSON.stringify(entity),
      user: userId }]
  }).save();
}

async function update(entityId, entity) {
  return await Entity.findByIdAndUpdate(entityId, {$set: {data: JSON.stringify(entity)}}, {new: true});
}

async function get(entityId) {
  return await Entity.findById(entityId);
}

async function list(userId, schemaId) {
  return await Entity.find({
    user: userId,
    _schema: schemaId
  });
}
