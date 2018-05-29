const Entity = require('../models/entity.model');
const utils = require('../utils');

module.exports = {
  insert,
  update,
  get,
  list,
  clone,
  remove,
}

async function insert(userId, schemaId, entity) {
  entity.modes = [{
    user: userId,
    data: {}
  }];
  return await new Entity({
    _schema: schemaId,
    user: userId,
    name: entity.name,
    description: entity.description,
    modes: utils.stringifyModesData(entity.modes)
  }).save();
}

async function update(entityId, entity) {
  if (entity.modes) utils.stringifyModesData(entity.modes);
  return await Entity.findByIdAndUpdate(entityId, {$set: 
    {modes: entity.modes}}, {new: true});
}

async function get(entityId) {
  return await new Promise((resolve, reject) => {
    Entity.findById(entityId).populate('_schema').exec((err, doc) => {
      if (err) return reject(err);
      doc = doc.toObject();
      utils.parseModesData(doc.modes);
      resolve(doc);
    })
  });
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
