'use strict';

// Arena routes use arena controller
var arena = require('../controllers/arena');

module.exports = function(app, passport) {

app.get('/arena/home', arena.home);
app.get('/arena', arena.home);
app.get('/arena/:arenaId', arena.detail);
app.param('arenaId',arena.arena);
};
