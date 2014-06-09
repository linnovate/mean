'use strict';

//Setting up controllers
angular.module('mean.articles')
    .controller('ArticlesIndexCtrl', ['$scope', 'articles', 'Prepared', 'Paginator', function ($scope, articles, Prepared, Paginator) {
        var prepared = [];
        if(articles.length > 0){
            prepared = Prepared.get(articles);
        }
        $scope.paginator =  Paginator(2,5,prepared);
        $scope.hasItems = ($scope.paginator.items.length > 0);
    }])
    .controller('ArticlesParentCtrl', ['$scope', '$timeout', '$upload', 'categories', function ($scope, $timeout, $upload, categories) {
        
        $scope.article = {};
        $scope.article.categories = undefined;
        $scope.states = categories;
        
        function setPreview(fileReader, index) {
            fileReader.onload = function(e) {
                $timeout(function() {
                    $scope.dataUrls[index] = e.target.result;
                });
            };
        }
        
        $scope.fileReaderSupported = window.FileReader !== null;
        $scope.uploadRightAway = true;
	
        $scope.hasUploader = function(index) {
            return (typeof $scope.upload[index] !== 'undefined');
        };
        $scope.abort = function(index) {
            $scope.upload[index].abort();
            $scope.upload[index] = null;
        };
	
        $scope.onFileSelect = function($files) {
            $scope.selectedFiles = [];
            $scope.progress = [];
            if ($scope.upload && $scope.upload.length > 0) {
                for (var i = 0; i < $scope.upload.length; i++) {
                    if ($scope.upload[i] !== null) {
                        $scope.upload[i].abort();
                    }
                }
            }
            $scope.upload = [];
            $scope.uploadResult = [];
            $scope.selectedFiles = $files;
            $scope.dataUrls = [];
            for (var y = 0; y < $files.length; y++) {
                var $file = $files[y];
                var isImage = /\.(jpeg|jpg|gif|png)$/i.test($file.name);
                if(!isImage){
                    alert('Only images are allowed');
                    return;
                }
                if (window.FileReader && $file.type.indexOf('image') > -1) {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL($files[y]);
                    setPreview(fileReader, y);
                }
                $scope.progress[y] = -1;
                if ($scope.uploadRightAway) {
                    $scope.start(y);
                }
            }
        };
	
        $scope.start = function(index) {
            $scope.progress[index] = 0;
            $scope.upload[index] = $upload.upload({
                url :'/articles/api/upload',
                method: 'POST',
                headers: {
                    'x-ng-file-upload': 'lalista'
                },
                data :  (typeof $scope.article.avatar === 'undefined')?null:$scope.article.avatar,
                file: $scope.selectedFiles[index],
                fileFormDataName: 'avatar'
            })
            .then(
                function(response) {
                    $scope.uploadResult.push(response.data);
                    $timeout(function() {
                        $scope.article.avatar =  response.data.avatar;
                    });
                },
                null,
                function(evt) {
                    $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
                })
            .xhr(function(xhr){
                xhr.upload.addEventListener('abort', function(){
                        console.log('aborted complete');
                    }, 
                    false);
            });
        };
        
    }])
    .controller('ArticlesCreateCtrl', ['$scope', '$state', '$filter', '$timeout', '$controller', '$upload', 'categories', 'Articles', function ($scope, $state, $filter, $timeout, $controller, $upload, categories, Articles) {
        
        angular.extend($scope, new $controller('ArticlesParentCtrl', {
            $scope:$scope,
            $timeout:$timeout,
            $upload:$upload,
            categories:categories
        }));
        
        
        
        
        $scope.save = function(){
             $scope.article.categories = $filter('strcstoarray')($scope.article.categories);
             Articles.store($scope.article).then(
                 function(response) {
                    $scope.article = response;
                    return $state.transitionTo('articles');
                 }, 
                 function(reason) {
                     throw new Error(reason);
                 }
             );
         };
         
    }])
    .controller('ArticlesEditCtrl', ['$scope', '$state', '$filter', '$timeout', '$controller', '$upload', 'article', 'categories' ,'Articles', function ($scope, $state, $filter, $timeout, $controller, $upload, article, categories, Articles) {
        
        angular.extend($scope, new $controller('ArticlesParentCtrl', {
            $scope:$scope,
            $timeout:$timeout,
            $upload:$upload,
            categories:categories
        }));
        
        var original = article;
        $scope.article = Articles.copy(original);
        
        $scope.isClean = function() {
            return angular.equals(original, $scope.article);
        };
        
        $scope.save = function() { 
            $scope.article.categories = angular.isArray($scope.article.categories)?$scope.article.categories:$filter('strcstoarray')($scope.article.categories);
            $scope.article.put().then(
                function(data) {
                    $scope.article = data;
                    return $state.transitionTo('articles');
                },
                function error(reason) {
                    throw new Error(reason);
                }
            );
        };
        
    }])
    .controller('ArticlesDeleteCtrl', ['$scope', '$state', 'article', function ($scope, $state, article) {
        $scope.save = function() {
            return $state.transitionTo('articles');
        };
        
        $scope.destroy = function() {
            article.remove().then(
                function() {
                    return $state.transitionTo('articles');
                },
                function error(reason) {
                    throw new Error(reason);
                }
                );
        };
    }])
    .controller('ArticlesListaCtrl', ['$scope', 'categories', 'articles', 'Articles', function ($scope, categories, articles, Articles) {
        $scope.categories = categories;
        $scope.oneAtATime = false;
        $scope.findByCategory = function(category) {
            return Articles.findByCategory(articles,category);
        };
    }]);

