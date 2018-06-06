const Entity = require('../models/entity.model');
const utils = require('../utils');

module.exports = {
  insert,
  update,
  get,
  list,
  clone,
  remove,
  tree,
}

async function insert(userId, schemaId, entity) {
  entity.modes = entity.modes || [{
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
  return await Entity.findByIdAndUpdate(entityId, {
    $set: {
      modes: entity.modes,
      updated: new Date()
    }}, {new: true});
}

async function get(entityId) {
  return await new Promise((resolve, reject) => {
    Entity.findById(entityId).populate('_schema').exec((err, doc) => {
      if (err || !doc) return reject(err);
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
      if (err || !doc) return reject();
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
        data = data.filter(d => d._schema);
        data = data.map(d => {
          d = d.toObject();
          utils.parseModesData(d.modes);
          return d;
        });
        resolve(data.filter(d => d._schema));
      });
    })
}

async function tree(schemas) {
  return await Entity.aggregate([
    {$match: {_schema: {$in: schemas}}},
    {$group:{
    _id: "$_schema",
    name: {$first: "$name"},
    modes: {$first: "$modes"}}},
     { $project:
        { 
          children:
           {
             $map:
                {
                  input: "$modes",
                  as: "mode",
                  in:  {name: "$$mode.name", _id: "$$mode._id", type: 'ts'}
                }
           },
           name: '$name'
        }
     }])
}