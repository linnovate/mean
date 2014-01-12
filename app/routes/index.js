'use strict';

module.exports = function(app, passport) {
    
    // Home route
    var index = require('../controllers/index');
    app.get('/', index.render);

};
