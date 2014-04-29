'use strict';


var search = require('../controllers/search');

module.exports = function(app, passport) {
    app.get('/search/company', search.getCompany);
    app.post('/search/team', search.getTeam);
    app.post('/search/user', search.getUser);


    app.get('/search/search/team', search.searchTeam);
};