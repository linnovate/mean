'use strict';

var mean = require('meanio');
module.exports = function(System){
  return {
    render:function(req,res){
      res.render('index',{ locals: { config: System.config.clean }});
    },
    aggregatedList:function(req,res) {
      res.send(res.locals.aggregatedassets);
    }
  };
};
