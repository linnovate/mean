function HeaderController($scope, $location, Global) {
	$scope.global = Global;
	$scope.menu = [
		{
			"title": "Articles",
			"link": "articles"
		},
		{
			"title": "Create New Article",
			"link": "articles/create"
		}
	];

	$scope.init = function() {

	};
}