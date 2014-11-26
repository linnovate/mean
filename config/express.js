'use strict';

/**
 * Module dependencies.
 */
var mean = require('meanio'),
  compression = require('compression'),
  morgan = require('morgan'),
  consolidate = require('consolidate'),
  cookieParser = require('cookie-parser'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  assetmanager = require('assetmanager'),
  session = require('express-session'),
  mongoStore = require('connect-mongo')(session),
  helpers = require('view-helpers'),
  flash = require('connect-flash'),
  config = mean.loadConfig();

function onAggregatedSrc(loc,ext,res,next,data){
  res.locals.aggregatedassets[loc][ext] = data;
  next && next();
}

module.exports = function(app, passport, db) {

  app.set('showStackError', true);

  // Prettify HTML
  app.locals.pretty = true;

  // cache=memory or swig dies in NODE_ENV=production
  app.locals.cache = 'memory';

  // Should be placed before express.static
  // To ensure that all assets and data are compressed (utilize bandwidth)
  app.use(compression({
    // Levels are specified in a range of 0 to 9, where-as 0 is
    // no compression and 9 is best compression, but slowest
    level: 9
  }));

  // Only use logger for development environment
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // assign the template engine to .html files
  app.engine('html', consolidate[config.templateEngine]);

  // set .html as the default extension
  app.set('view engine', 'html');

  // The cookieParser should be above session
  app.use(cookieParser());

  // Request body parsing middleware should be above methodOverride
  app.use(expressValidator());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  // Import the assets file and add to locals
  var assets = assetmanager.process({
    assets: require('./assets.json'),
    debug: process.env.NODE_ENV !== 'production',
    webroot: /public\/|packages\//g
  });
  for(var i in assets.core.css){
    mean.aggregate('css',assets.core.css[i],{group:'header',singlefile:true},mean.config.clean);
  }
  for(var i in assets.core.js){
    mean.aggregate('js',assets.core.js[i],{group:'footer',singlefile:true,global:true,weight:-1000000+i},mean.config.clean);
  }

  // Add assets to local variables
  app.use(function(req, res, next) {
    //res.locals.assets = assets;
    res.locals.aggregatedassets = {header:{},footer:{}};

    mean.aggregatedsrc('css', 'header', onAggregatedSrc.bind(null,'header','css',res,null));
    mean.aggregatedsrc('js', 'header', onAggregatedSrc.bind(null,'header','js',res,null));
    mean.aggregatedsrc('css', 'footer', onAggregatedSrc.bind(null,'footer','css',res,null));
    mean.aggregatedsrc('js', 'footer', onAggregatedSrc.bind(null,'footer','js',res,next));
  });

  // Express/Mongo session storage
  app.use(session({
    secret: config.sessionSecret,
    store: new mongoStore({
      db: db.connection.db,
      collection: config.sessionCollection
    }),
    cookie: config.sessionCookie,
    name: config.sessionName,
    resave: true,
    saveUninitialized: true
  }));

  // Dynamic helpers
  app.use(helpers(config.app.name));

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  //mean middleware from modules before routes
  app.use(mean.chainware.before);

  // Connect flash for flash messages
  app.use(flash());
};
