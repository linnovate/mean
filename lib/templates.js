var eol = require('os').EOL;

exports.app = [
    ' '
  , '/*'
  , ' * Defining the Package'
  , ' */'
  , ''
  , 'var Module = require("meanio").Module;'
  , ''
  , 'var {{class}} = new Module("{{class}}");'
  , ''
  , '/*'
  , ' * All MEAN packages require registration'
  , ' * Dependency injection is used to define required modules'
  , ' */'
  , ''
  , '{{class}}.register(function(app, auth, database) {'
  , ''
  , '    //We enable routing. By default the Package Object is passed to the routes'
  , '    {{class}}.routes(app, auth, database);'
  , ''
  , '    //We are adding a link to the main menu for all authenticated users'
  , '    {{class}}.menus.add({'
  , '      title: "{{name}} example page",'
  , '      link: "{{name}} example page",'
  , '      roles: ["authenticated"],'
  , '      menu: "main"'
  , '    })'
  , ''
  , '    /*'
  , '    //Uncomment to use. Requires meanio@0.3.7 or above'
  , '    // Save settings with callback'
  , '    // Use this for saving data from administration pages'
  , "    {{class}}.settings({'someSetting':'some value'},function (err, settings) {"
  , '      //you now have the settings object'
  , '    });'
  , ''
  , '    // Another save settings example this time with no callback'
  , '    // This writes over the last settings.'
  , "    {{class}}.settings({'anotherSettings':'some value'});"
  , ''
  , '    // Get settings. Retrieves latest saved settigns'
  , '    {{class}}.settings(function (err, settings) {'
  , '      //you now have the settings object'
  , '    });'
  , '    */'
  , ''
  , '    return {{class}};'    
  , '});'
].join(eol);

exports.packagejson = [
  '{'
  ,'  "name": "{{name}}",'
  ,'  "version": "0.0.0",'
  ,'  "description": "Some description of {{name}}",'
  ,'  "author": {'
  ,'    "name": "{{author}}"'
  ,'  },'
  ,'  "mean" : true,'
  ,'  "engines": {'
  ,'    "node": "0.10.x",'
  ,'    "npm": "1.4.x"'
  ,'  },'
  ,'  "dependencies": {'
  ,'  },'
  ,'  "license": "MIT"'
  ,'}'

].join(eol);

exports.clientRoutes = [
 "'use strict';"
,""
,"angular.module('mean').config(['$stateProvider', '$urlRouterProvider',"
,"  function($stateProvider, $urlRouterProvider) {"
,"    $stateProvider"
,"      .state('{{name}} example page', {"
,"        url: '/{{name}}/example',"
,"        templateUrl: '{{name}}/views/index.html'"
,"      })"
,"  }"
,"])"
].join(eol);


exports.clientController = [
 "'use strict';"
,""
,"angular.module('mean').controller('{{class}}Controller', ['$scope', 'Global',"
,"  function($scope, Global, {{class}}) {"
,"    $scope.global = Global;"
,"    $scope.{{name}} = {name:'{{name}}'};"
,""
,"  }"
,"]);"
].join(eol);


exports.clientService = [
 "'use strict';"
,""
,"angular.module('mean').factory('{{class}}', ["
,"    function() {        "
,"        return {name:'{{name}}'};"
,"    }"
,"]);"
].join(eol);


exports.clientView = [
'<div class="" data-ng-controller="{{class}}Controller">'
,'   <h1>Example view from your new awesome package</h1>'
,'   <h2>Package: {{{{name}}.name}}</h2>'
,'   <ol>'
,'   <li><a href="{{name}}/example/anyone">Server route that anyone can access</a></li>'
,'   <li><a href="{{name}}/example/auth">Server route that requires authentication</a></li>'
,'   <li><a href="{{name}}/example/admin">Server route that requires admin user</a></li>'
,'   <li><a href="{{name}}/example/render">Raw Html rendering example from using swig</a></li>'
,'   </ol>'
,'   <h3><img src="/{{name}}/assets/img/logo.png"/></h3></br>'
,'   <p class="alert alert-info">You can find your package in /packages/{{name}}</p></br>'
,'   <p class="alert alert-warning">MEAN versions prior to 0.3.2 will be in /node_modules/{{name}}</p></br>'
,'   <h3><a href="http://www.mean.io/#!/docs">Documentation</a></h3></br>'
,'</div>'
].join(eol);

exports.serverRoutes = [
 "'use strict';"
,""
,"// The Package is past automatically as first parameter"
,"module.exports = function({{class}}, app, auth, database) {"
,""
,"    app.get('/{{name}}/example/anyone', function (req,res,next) {"
,"      res.send('Anyone can access this');"
,"    });"
,""
,"    app.get('/{{name}}/example/auth',auth.requiresLogin, function (req,res,next) {"
,"      res.send('Only authenticated users can access this');"
,"    });"
,""
,"    app.get('/{{name}}/example/admin',auth.requiresAdmin, function (req,res,next) {"
,"      res.send('Only users with Admin role can access this');"
,"    });    "
,""
,"    app.get('/{{name}}/example/render', function (req,res,next) {"
,"      {{class}}.render('index', {package:'{{name}}'}, function (err, html) {"
,"        //Rendering a view from the Package server/views"
,"        res.send(html);"
,"      })"
,"    })"
,"};"
].join(eol);

exports.serverView = [
 '<h1>This is rendered from the package itself.</h1>'
,'<h2>The modules using swig by default</h2>'
,'<img href="http://mean.io" src="/{{package}}/assets/img/logo.png"/>'
].join(eol);
