'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles', 'pcselector', 'company']);

angular.module('mean.system', []);
angular.module('mean.articles', []);
angular.module('company', ['pcselector']);