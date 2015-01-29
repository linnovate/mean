'use strict';
/* global jQuery:true */

angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap(document, ['mean']);

});

function processModules(modules) {
  var packageModules = ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router'],m,mn;
  for (var index in modules) {
    m = modules[index];
    mn = 'mean.'+m.name;
    angular.module(mn, m.angularDependencies || []);
    packageModules.push(mn);
  }

  angular.module('mean', packageModules);
}

jQuery.ajax('/_getModules', {
  dataType: 'json',
  async:false,
  success: processModules
});

