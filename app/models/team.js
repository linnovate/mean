'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Team Schema
 */
var TeamSchema = new Schema({
    id: {
    	type: String,
    	default: "NULL"
    },
    
    name: String,
    logo_path: String,
    member:{
    	member_id: Array,
    	member_score: Array
    },
    company_id: String,
    leader_id: String
});

/**
 * Validations
 */
TeamSchema.path('name').validate(function(name) {
    return name.length;
}, '组名不能为空!');


mongoose.model('Team', TeamSchema);
