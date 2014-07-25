'use strict';

/**
 * Module dependencies.
 */

module.exports = function(database) {
  var Schema = database.connection.Schema;
  /**
   * Package Schema
   */
  var PackageSchema = new Schema({
    name: String,
    settings: {},
    updated: {
      type: Date,
      default: Date.now
    }
  });

  database.connection.model('Package', PackageSchema);
};
