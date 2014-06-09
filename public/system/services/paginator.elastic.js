'use strict';

angular.module('mean.system')
    .factory('Paginator', function() {
        return function(pageSize,navRange,data) {
            var cache =[];
            var hasNext = false;
            var currentOffset= 0;
            var numOfItemsXpage = pageSize;
            var pageRange = navRange;
            var numOfItems = 0;
            var totPages = 0;
            var currentPage = 1;
            var end = 0;
            var start = 0;
            var delta = 1;
            var load = function() {
                cache = data;
                numOfItems = cache.length;
                hasNext = numOfItems > numOfItemsXpage;
                totPages = Math.ceil(numOfItems/numOfItemsXpage);
                if (pageRange > totPages) {
                    pageRange = totPages;
                }
                loadFromCache();
            };
            var loadFromCache= function() { 
                paginator.items = cache.slice(currentOffset, numOfItemsXpage*currentPage);
                delta = Math.ceil(pageRange / 2);
                if (currentPage - delta > totPages - pageRange) {
                    start = totPages - pageRange + 1;
                    end = totPages+1;
                }
                else {
                    if (currentPage - delta < 0) {
                        delta = currentPage;
                    }
                    var offset = currentPage - delta;
                    start = offset + 1;
                    end = offset + pageRange +1;
                }
                hasNext = numOfItems > (currentPage * numOfItemsXpage);
            };
            var paginator = {
                items : [],
                hasNext: function() {
                    return hasNext;
                },
                hasPrevious: function() {
                    return currentOffset !== 0;
                },
                hasFirst: function() {
                    return currentPage !== 1; 
                },
                hasLast: function() {
                    return totPages > 2 && currentPage!==totPages; 
                },
                next: function() {
                    if (this.hasNext()) {
                        currentPage++;
                        currentOffset += numOfItemsXpage;
                        loadFromCache();
                    }
                },
                previous: function() {
                    if(this.hasPrevious()) {
                        currentPage--;
                        currentOffset -= numOfItemsXpage;
                        loadFromCache();
                    }
                },
                toPageId:function(num){
                    currentPage=num;
                    currentOffset= (num-1) * numOfItemsXpage;
                    loadFromCache();
                },
                first:function(){
                    this.toPageId(1);
                },
                last:function(){
                    this.toPageId(totPages);
                },
                getNumOfItems : function(){
                    return numOfItems;
                },
                getCurrentPage: function() {
                    return currentPage;
                },
                getEnd: function() {
                    return end;
                },
                getStart: function() {
                    return start;
                },
                getTotPages: function() {
                    return totPages;
                },
                getNumOfItemsXpage:function(){
                    return numOfItemsXpage;
                }
            };
            load();
            return paginator;
        };
    })
    .filter('pagination', function() {
        return function(input,start,end) {
            start = parseInt(start,10);
            end = parseInt(end,10);
            for (var i = start; i < end; i++) {
                input.push(i);
            }
            return input;
        };
    });
