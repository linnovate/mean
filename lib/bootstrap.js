'use strict';

var express = require('express'),
  Grid = require('gridfs-stream'),
  errorHandler = require('errorhandler'),
  fs = require('fs'),
  http = require('http'),
  https = require('https'),
  appPath = process.cwd();



module.exports = function(Meanio) {

  var db = Meanio.Singleton.get('database').connection;
  var config = Meanio.Singleton.config.clean;

  // Register app dependency;
  Meanio.Singleton.register('app', function(access, database) {
    require(appPath + '/config/express')(app, access.passport, database.connection);
    return app;
  });


  // Express settings
  var app = express();

  var gfs = new Grid(db.connection.db, db.mongo);

  if(config.aggregation!==false){
    var jqueryminmap = fs.readFileSync(config.root + '/bower_components/jquery/dist/jquery.min.map');
    app.get('/modules/jquery.min.map',function(req,res){
      res.send(jqueryminmap);
    });
    app.get('/modules/aggregated.js', function(req, res) {

      res.setHeader('content-type', 'text/javascript');

      Meanio.Singleton.aggregated('js', req.query.group ? req.query.group : 'footer', function(data) {
        res.send(data);
      });

    });
  }

  function themeHandler(req, res) {

    res.setHeader('content-type', 'text/css');

    gfs.files.findOne({
      filename: 'theme.css'
    }, function(err, file) {

      if (!file) {
        fs.createReadStream(config.root + '/bower_components/bootstrap/dist/css/bootstrap.css').pipe(res);
      } else {
        // streaming to gridfs
        var readstream = gfs.createReadStream({
          filename: 'theme.css'
        });

        //error handling, e.g. file does not exist
        readstream.on('error', function(err) {
          console.log('An error occurred!', err.message);
          throw err;
        });

        readstream.pipe(res);
      }
    });
  }

  // We override this file to allow us to swap themes
  // We keep the same public path so we can make use of the bootstrap assets
  app.get('/bower_components/bootstrap/dist/css/bootstrap.css', themeHandler);

  app.get('/modules/aggregated.css', function(req, res) {
    res.setHeader('content-type', 'text/css');

    Meanio.Singleton.aggregated('css', req.query.group ? req.query.group : 'header', function(data) {
      res.send(data);
    });
  });

  app.use('/bower_components', express.static(config.root + '/bower_components'));

  Meanio.Singleton.events.on('modulesEnabled', function() {

    for (var name in Meanio.Singleton.modules) {
      app.use('/' + name, express.static(config.root + '/' + Meanio.Singleton.modules[name].source + '/' + name.toLowerCase() + '/public'));
      if(Meanio.Singleton.config.clean.aggregate===false){
        app.use('/' + Meanio.Singleton.modules[name].source + '/' + name + '/public', express.static(config.root + '/' + Meanio.Singleton.modules[name].source + '/' + name.toLowerCase() + '/public'));
      }
    }

    // We are going to catch everything else here
    app.route('*').get(function(req, res, next) {
      if (!Meanio.Singleton.template) return next();
      Meanio.Singleton.template(req, res, next);
    });

    // Assume "not found" in the error msgs is a 404. this is somewhat
    // silly, but valid, you can do whatever you like, set properties,
    // use instanceof etc.
    app.use(function(err, req, res, next) {
      // Treat as 404
      if (~err.message.indexOf('not found')) return next();

      // Log it
      console.error(err.stack);

      // Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });

    // Error handler - has to be last
    if (process.env.NODE_ENV === 'development') {
      app.use(errorHandler());
    }
  });

  // Listen on http.port (or port as fallback for old configs)
  var httpServer = http.createServer(app);
  Meanio.Singleton.register('http', httpServer);
  httpServer.listen(config.http ? config.http.port : config.port, config.hostname);

  if (config.https && config.https.port) {
    var httpsOptions = {
      key: fs.readFileSync(config.https.ssl.key),
      cert: fs.readFileSync(config.https.ssl.cert)
    };

    var httpsServer = https.createServer(httpsOptions, app);
    Meanio.Singleton.register('https', httpsServer);
    httpsServer.listen(config.https.port);
  }

  Meanio.Singleton.Module.bootstrapModules();

  Meanio.Singleton.name = config.app.name;
  Meanio.Singleton.app = app;
  Meanio.Singleton.menus = new (Meanio.Singleton.Menus)();
};
