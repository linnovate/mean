'use strict';

//Prepared articles 
angular.module('mean.articles')
    .factory('Prepared',function($filter){
        return {
            get:function(articles){
                var data = [];
                angular.forEach(articles, function(value, key){
                    this.push({
                        id:value._id,
                        title:value.title,
                        description:value.description,
                        avatar:value.avatar,
                        price:$filter('currency')(value.price),
                        categories:$filter('arraytostrcs')(value.categories)
                    });
                }, data);
                return data;
            }
        };   
    });