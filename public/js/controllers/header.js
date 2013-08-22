function HeaderController($scope, $location, Global) {
    $scope.global = Global;
    $scope.menu = [{
        "title": "Articles",
        "link": "articles"
    }, {
        "title": "Create New Article",
        "link": "articles/create"
    }];

    $scope.init = function() {

    };

    $scope.isSelected = function(item) {        
        if ($location.path() == "/"+item.link) {
            return "active"
        } else return ""
    }
}