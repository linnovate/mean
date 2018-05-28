const Entity = require('../models/entity.model');

module.exports = {
  insert,
  update,
  get,
  list,
  clone,
  remove,
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

async function remove(entityId) {
  return await Entity.findByIdAndDelete(entityId);
}

async function clone(entityId) {
  return await new Promise((resolve, reject) => {
    Entity.findById(entityId).exec((err, doc) => {
      if (err) return reject();
      delete doc._doc._id;
      doc.isNew = true;
      return resolve(new Entity(doc).save());
    });
  });
}

async function list(userId, type) {
  return await new Promise((resolve, reject) => {
    Entity.find({
      }).populate({
        path: '_schema',
        match: {type}
      }).exec((err, data) => {
        resolve(data.filter(d => d._schema));
      });
    })
}
