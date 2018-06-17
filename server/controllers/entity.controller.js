const Entity = require('../models/entity.model');
const utils = require('../utils');

module.exports = {
  insert,
  update,
  get,
  clone,
  cloneMode,
  remove,
  tree,
  checkUniqueMode,
  findById,
}

async function insert(userId, entity) {
  entity._schema = entity.schema;
  entity.user = userId;
  return await new Entity(entity).save();
}

async function checkUniqueMode(entity, body, params) {
  // body for update mode name
  // params for clone mode
  
  // update fields in existing mode
  if (body.modes && body.modes[0].name === params.modeName) return await true;
  
  let modeName = body.modes ? body.modes[0].name : `${params.modeName} (copy)`;

  let result = entity.modes.find(e => {
    return e.name === modeName
  });
  if (result) return await false;
  return await true;
}

async function findById(entityId) {
  return await Entity.findById(entityId);
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
    updated: new Date(),
    icon: entity.icon,
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

async function clone(entity) {
  entity.name = `${entity.name} (copy)`;
  delete entity._doc._id;
  entity.isNew = true;
  return await new Entity(entity).save();
}

async function tree(schemas, field) {
  let group = {_id: "$_schema"};
  if (field === 'all') group.children = {$push: "$$ROOT"}
  if (field === 'name') group.children = {$push: {name: "$name", _id: "$_id", category: "$category"}};
  return await Entity.aggregate([{
    $match: {_schema: {$in: schemas}}},
    {
      $group: group
  }]);
}