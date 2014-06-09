'use strict';

//Setting up routes
angular.module('mean.articles').config(['$stateProvider',
    function($stateProvider) {

        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($http) {
            return $http.get('/loggedin');
        };
        
        //================================================
        // Check if the user is admin
        //================================================
        var checkLoggedinAdmin = function($http) {
            return $http.get('/loggedinadmin');
        };

        // states for my app
        $stateProvider
            .state('articles', {
                url: '/articles',
                templateUrl: 'articles/views/articles.html',
                resolve: {
                    loggedin: checkLoggedin,
                    articles: function(Articles){
                        return Articles.all();
                    }
                },
                controller: 'ArticlesIndexCtrl'
            })
            .state('create_article', {
                url: '/articles/create',
                templateUrl: 'articles/views/form.html',
                resolve: {
                    loggedin: checkLoggedinAdmin,
                    categories: function(Categories){
                        return Categories.all().then(function(data){
                            return data;
                        });
                    }
                },
                controller: 'ArticlesCreateCtrl'
            })
            .state('edit_article', {
                url: '/articles/:id/edit',
                templateUrl: 'articles/views/form.html',
                resolve: {
                    loggedin: checkLoggedin,
                    article: function(Articles, $stateParams){
                        return Articles.one($stateParams.id);
                    },
                    categories: function(Categories){
                        return Categories.all().then(function(data){
                            return data;
                        });
                    }
                },
                controller: 'ArticlesEditCtrl'
            })
            .state('delete_article', {
                url: '/articles/:id/delete',
                templateUrl: 'articles/views/delete.html',
                resolve: {
                    loggedin: checkLoggedin,
                    article: function(Articles, $stateParams){
                        return Articles.one($stateParams.id);
                    }
                },
                controller: 'ArticlesDeleteCtrl'
            });
    }]);
