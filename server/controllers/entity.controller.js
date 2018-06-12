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

async function insert(userId, entity) {
  entity._schema = entity.schema;
  entity.user = userId;
  return await new Entity(entity).save();
}

async function update(entityId, modeName, entity) {
  let query, update, _entity;

  query = {
    _id: entityId,
  };

  _entity = {
    name: entity.name, 
    description: entity.description,
    iff: entity.iff,
    updated: new Date()
  };

  update = {
    $set: _entity
  };

  if (modeName) { // update existing mode
    query['modes.name'] = modeName;
    _entity['modes.$'] = entity.modes[0];
  }
  else { // push new mode
    update['$push'] = {
      modes: entity.modes[0]
    }
  }

  return await Entity.findOneAndUpdate(query, update, {new: true});
}

async function get(entityId, modeName) {
  return await new Promise((resolve, reject) => {
    let query = {_id: entityId };
    let fields = {
      name: 1,
      description: 1,
      icon: 1,
      iff: 1,
    }
    if (modeName) {
      query['modes.name'] = modeName;
      fields['modes.$'] = 1;
    }
    Entity.findOne(query, fields).populate('_schema').exec((err, doc) => {
      if (err || !doc) return reject(err);
      resolve(doc);
    })
  });
}

async function remove(entityId, modeName) {
  // system must have no this entity as a dependency
  if (!modeName) return await Entity.findByIdAndDelete(entityId);
  return await Entity.findOneAndUpdate({_id: entityId}, {$pull: {modes: {name: modeName}}}, {new: true});
}

async function cloneMode(entityId, modeName) {
  return await new Promise((resolve, reject) => {
    Entity.findOne({_id: entityId, 'modes.name': modeName}, {'modes.$' : 1}).exec((err, doc) => {
      if (err || !doc) return reject();
      const mode = doc.modes[0];
      mode.name = `${mode.name} (copy)`;
      return resolve(Entity.findOneAndUpdate({_id: entityId}, {$push: {modes: mode}}, {new: true}));
    });
  });
}

async function clone(entityId, modeName) {
  if (modeName) return cloneMode(entityId, modeName);
  return await new Promise((resolve, reject) => {
    Entity.findById(entityId).exec((err, doc) => {
      if (err || !doc) return reject();
      doc.name = `${doc.name} (copy)`;
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
  return await Entity.aggregate([{
    $match: {_schema: {$in: schemas}}},
    {
      $group: {
        _id: "$_schema",
        children: {$push: "$$ROOT"}}
  }]);
}