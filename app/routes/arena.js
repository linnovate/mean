'use strict';

// Arena routes use arena controller
var arena = require('../controllers/arena');

module.exports = function(app, passport) {

app.get('/arena/home', arena.home);
app.get('/arena', arena.home);
app.get('/arena/detail/:arenaId', arena.detail);
app.get('/arena/rob/:arenaId',arena.rob);
app.post('/arena/addCampaignInfo/:arenaId',arena.addCampaignInfo);
app.get('/arena/challenge/:arenaId',arena.challenge);
app.param('arenaId',arena.arena);
};
