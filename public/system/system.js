'use strict';

angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.router', 'mean.system', 'mean.articles','mean.auth']);

angular.module('mean.system', ['mean.controllers.login','mean-factory-interceptor']);