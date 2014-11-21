'use strict';

(function () {

    var httpProviderIt;
    var _httpInterceptor;

    describe('system public services', function () {
        describe('httpInterceptor', function () {

            beforeEach(function () {

                module('mean-factory-interceptor');

                module('mean-factory-interceptor', function ($httpProvider) {
                    httpProviderIt = $httpProvider;
                });


                inject(function (httpInterceptor) {
                    _httpInterceptor = httpInterceptor;
                });
            });

            // check to see if it has the expected function
            it('should exist', function () {
                expect(_httpInterceptor).toBeDefined();
            });

            it('should be contained as an interceptor', function () {
                expect(httpProviderIt.interceptors).toContain('httpInterceptor');
            });

            it('should have an empty response', function () {
                var response = {};
                expect(_httpInterceptor.response(response)).toBe(response);
            });

            it('should reject by response', function (done) {

                inject(function ($q, $rootScope) {
                    var rejection = {status: 401};

                    _httpInterceptor.response(rejection).then(function () {
                        },
                        function (reason) {
                            expect(reason).toBe(rejection);
                            done();
                        });

                    $rootScope.$apply();
                });
                
            });

            it('should reject by responseError', function (done) {

                inject(function ($q, $rootScope) {
                        var rejection = {status: 401};

                        _httpInterceptor.responseError(rejection).then(function () {
                            },
                            function (reason) {
                                expect(reason).toBe(rejection);
                                done();
                            });

                        $rootScope.$apply();
                    }
                );
            });

        });
    });
}());
