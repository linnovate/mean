'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CircleSchema = new Schema({
  created: Date,
  updated: Date,
  category: [String],
  description: String,
  name: {
    type: String,
    required: true,
    unique: true
  },
  circles: [String],
});

//add index
CircleSchema.statics.buildPermissions = function(callback) {

  var data = {

  };

  this.find({}).sort({
    circle: 1
  }).exec(function(err, circles) {

    circles.forEach(function(circle) {

      data[circle.name] = circle.toObject();
      data[circle.name].containers = circle.circles;
      data[circle.name].parents = [];
      data[circle.name].decendants = [];
      data[circle.name].children = [];

    });

    var found = true;
    //yes not efficient - getting there..
    var level = 0;
    while (found) {
      found = false;

      circles.forEach(function(circle) {

        var containers = data[circle.name].containers;

        //going through each of the containers parents
        containers.forEach(function(container) {

          if (data[container].decendants.indexOf(circle.name) == -1) {
            data[container].decendants.push(circle.name.toString());
            if (level === 0) {
              data[circle.name].parents.push(container.toString());
              data[container].children.push(circle.name.toString());
            }
          }

          data[container].circles.forEach(function(circ) {
            if (containers.indexOf(circ) == -1 && circ != circle.name) {
              data[circle.name].containers.push(circ.toString());
              found = true;
            }
          });
        });
      });
      level++;
    }

    //now in the sample we are preparing the d3 representation

    var flare = {
      "name": "flare",
      "children": []
    }

    var tree = []

    for (var index in data) {
      buildTree(index, tree);
    }

    callback({
      tree: tree,
      circles: data
    });
  });


  function buildTree(id, branch) {

    if (1 || noParents(id) && hasChildren(id)) {

      var length = branch.length;

      branch.push({
        "name": data[id].name
      });

      if (hasChildren(id)) {
        branch[length].children = [];
      } else {
        branch[length].size = 1;
      }

      //only goes here if there are children
      data[id].children.forEach(function(child) {

        if (id !== child) {
          if (noChildren(child)) {
            branch[length].children.push({
              name: data[child].name,
              size: 1
            });
          } else {
            buildTree(child, branch[length].children);
          }
        }
      });
    }
  }

  function noParents(id) {
    return data[id].parents.length === 0
  }

  function noChildren(id) {
    return data[id].children.length === 0
  }

  function hasChildren(id) {
    return !noChildren(id);
  }
};

mongoose.model('Circle', CircleSchema);