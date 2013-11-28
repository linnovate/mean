//Setting up route
angular.module('mean').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/articles', {
            templateUrl: 'views/articles/list'
        }).
        when('/articles/create', {
            templateUrl: 'views/articles/create'
        }).
        when('/articles/:articleId/edit', {
            templateUrl: 'views/articles/edit'
        }).
        when('/articles/:articleId', {
            templateUrl: 'views/articles/view'
        }).
        when('/', {
            templateUrl: 'views/index'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);