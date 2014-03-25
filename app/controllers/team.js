'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Team = mongoose.model('Team');


var idEncode = function(name){
	return foo(id);
};


exports.info = function(req,res) {
	res.render('team/edit', {
        team: new Team()
    });
};
/**
 * Add or update team info
 */
exports.modify = function(req, res) {
    var team = new Team(req.body);
    var message = null;
    if(team.id == "NULL"){
    	team.id = team.company_id + "_" + idEncode(team.name);
    }
    team.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = '组已经存在!';
                    break;
                default:
                    message = '请填写完整的组信息!';
            }

            return res.render('/team', {
                message: message
            });
        }
    });
};



