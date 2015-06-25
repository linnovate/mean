'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Circles, app, auth, database) {

    var circles = require('../controllers/circles')(Circles, app);

    app.use(circles.loadCircles);
	app.use(circles.userAcl);
	app.use(circles.aclBlocker);


    app.get('/api/test', circles.test);
    app.get('/api/circles/visualize', circles.visualize);
    app.get('/api/circles/tree', circles.tree);

    app.route('/api/circles/:name?')
        .post(circles.create)
        .put(circles.update)
        .get(circles.mine);

};