'use strict';

angular.module('mean').controller('ArticlesController', ['$scope', '$stateParams', '$state', 'Global', 'Articles',
    function($scope, $stateParams, $state, Global, Articles) {
        $scope.global = Global;

        $scope.hasAuthorization = function(article){
            return ((($scope.global.isAdmin) || (!article.user)) || (article.user && (article.user._id === $scope.global.user._id)));
        };

        $scope.create = function() {
            var article = new Articles({
                title: this.title,
                content: this.content
            });
            article.$save(function(response) {
                $state.go('articles/' + response._id);
            });

            this.title = '';
            this.content = '';
        };

        $scope.remove = function(article) {
            if (article) {
                article.$remove();

                for (var i in $scope.articles) {
                    if ($scope.articles[i] === article) {
                        $scope.articles.splice(i, 1);
                    }
                }
            } else {
                $scope.article.$remove();
            }
            $state.go('all articles');
        };

        $scope.update = function() {
            var article = $scope.article;
            if (!article.updated) {
                article.updated = [];
            }
            article.updated.push(new Date().getTime());

            article.$update(function() {
                $state.go('articles/' + article._id);
            });
        };

        $scope.find = function() {
            Articles.query(function(articles) {
                $scope.articles = articles;
            });
        };

        $scope.findOne = function() {
            Articles.get({
                articleId: $stateParams.articleId
            }, function(article) {
                $scope.article = article;
            });
        };
    }
]);
