'use strict';

angular.module('mean').filter('isnew', function() {
    return function(input, days) {
        var timestamp = Date.parse(input);
        if (isNaN(timestamp)) {
            return false;
        }
        else {
            var diffDays = Math.round(Math.abs(((new Date(timestamp)).getTime() -
                                                (new Date()).getTime())/(24*60*60*1000)));
            var outdated = 1;
            if(days) outdated = days;
            return (diffDays < outdated);
        }
    };
});
