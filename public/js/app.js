'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles']);

angular.module('mean.system', ['mean-controller-login','mean-factory-interceptor']);
angular.module('mean.articles', []);