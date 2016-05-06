describe('StarterController', function() {
    var controller, scope;
    beforeEach(module('mean.meanStarter'));
    beforeEach(inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        controller = $controller('StarterController', { $scope: scope });
    }));

    it('package object in scope should contain proper package name', function() {
        expect(scope.package.name).toEqual('meanStarter');
    });
});