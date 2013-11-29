var should = chai.should();

describe('articles', function() {
    beforeEach(module('mean'));

    describe('ArticlesController', function() {
        var scope, ctrl, $httpBackend, Articles;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller, _Articles_) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();
            Articles = _Articles_;
            ctrl  = $controller('ArticlesController', {
                $scope: scope,
                Articles: Articles
            });
        }));

        describe('find', function() {
            var articles = [{name: 'foo'}, {name: 'bar'}];

            beforeEach(function() {
                $httpBackend.expectGET('articles').respond(articles);
            });

            it('should find all the articles', function() {
                scope.articles.should.have.length(0);
                scope.find();
                $httpBackend.flush();
                scope.articles.should.have.length(2);
            });
        });
    });
});
