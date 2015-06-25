// exports.inCircle = function(user, signature) {
// 	//circles
// 	//roles
// }

var meanio = require('meanio'),
    mongoose = require('mongoose'),
    Circle = mongoose.model('Circle');

module.exports = function(Circles, app) {

    return {

        test: function(req, res) {
            meanio.db.find('Project', function(err, data) {
                console.log(err);
                console.log(data);
                console.log('here')
            });
            return;
        },

        visualize: function(req, res) {
            Circles.render('index', {}, function(err, html) {
                res.send(html);
            });
        },

        tree: function(req, res) {
            Circle.buildPermissions(function(data) {
                res.send(data.tree);
            });
        },

        create: function(req, res) {

            var circle = new Circle(req.body);

            circle.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Cannot save the circle'
                    });
                }

                Circle.buildPermissions(function(data) {
                    app.set('circles', data);
                });

                res.json(circle);
            });
        },

        update: function(req, res) {

            if (!req.params.name) return res.send(404, 'No name specified');

            validateCircles(req.params.name, req.body.circles, function(err, status) {

                if (err) return res.send(400, status);

                Circle.findOne({
                    name: req.params.name
                }).exec(function(err, circle) {
                    if (!err && circle) {
                        Circle.findOneAndUpdate({
                            name: circle.name
                        }, {
                            $set: req.body
                        }, {
                            multi: false,
                            upsert: false
                        }, function(err, circle) {
                            if (err) {
                                return res.send(500, err.message);
                            }

                            Circle.buildPermissions(function(data) {
                                app.set('circles', data);
                            });

                            res.send(200, 'updated');
                        });
                    }
                });
            });
        },
        mine: function(req, res) {
            return res.send(req.acl.user);
        },
        all: function(req, res) {
            return res.send(req.acl.circles);
        },
        loadCircles: function(req, res, next) {
            var data = app.get('circles');

            if (!data) {
                Circle.buildPermissions(function(data) {
                    app.set('circles', data);
                    req.acl.tree = data.tree;
                    req.acl.circles = data.circles;

                    next();
                });
            } else {
                req.acl.tree = data.tree;
                req.acl.circles = data.circles;
                next();
            }
        },
        userAcl: function(req, res, next) {
            var roles = req.user && req.user.roles ? req.user.roles : ['annonymous'];

            var userRoles = {};

            roles.forEach(function(role) {
                if (req.acl.circles[role]) {
                    userRoles[role] = req.acl.circles[role];
                }
            });

            req.acl.user = {
                tree: Circle.buildTrees(userRoles),
                circles: userRoles
            };

            return next();
        }
    }

};



function validateCircles(name, circles, callback) {

    Circle.buildPermissions(function(data) {
        circles = [].concat(circles);

        circles.forEach(function(parent, index) {

            if (data.circles[name].decendants.indexOf(parent) !== -1) {
                return callback(true, 'Cannot reference parent in child relationship')
            }
            if (index === circles.length - 1) {
                return callback(null, 'valid');
            }
        });
    });
}

/*

,
        userRoles: function(req, res, next) {


            var roles = req.user && req.user.roles ? req.user.roles : ['annonymous'];

            var myRoles = {};

            roles.forEach(function(role) {
                if (req.circles[role]) {
                    myRoles[role] = req.circes[role];
                }
            });

            return myRoles;
        }
*/