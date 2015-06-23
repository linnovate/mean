

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
                res.send({
                    name: "flare",
                    children: data
                });
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

        all: function(req, res) {

            //return all circles available to req.user to view it in articles permissions list
            //FIX !!!
            
            var myCircles = [];
            var data = app.get('circles');

            function myPermissions(circles) {
                req.user.roles.forEach(function(role) {
                    myCircles = myCircles.concat(circles[role].decendants);
                    myCircles.push(role);
                });
                res.send(myCircles);
            }

            if (!data) {
                Circle.buildPermissions(function(data) {
                    app.set('circles', data);
                    myPermissions(data.circles);
                });

            }  else {
                myPermissions(data.circles);
            }
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