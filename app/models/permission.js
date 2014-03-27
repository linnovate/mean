var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Permission Schema
 */
var PermissionSchema = new Schema({
    id: String,
    name: String,
    role: {
    	type: Array,
    	default: ["MANAGER","EMPLOYEE","TEAMLEADER"]
    },
    team_id: String,
    company_id: String
});