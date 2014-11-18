'use strict';

(function() {

  var httpProviderIt;
  var http;
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

        inject(function($injector) {
            http = $injector.get('$http');
          });
      });

      // check to see if it has the expected function
      it('should exist', function () {
        expect(_httpInterceptor).toBeDefined();
      });

      it('should be contained as an interceptor', function () {
        expect(httpProviderIt.interceptors).toContain('httpInterceptor');
      });

      it('should have an empty response', function() {
        var response = {};
        expect(_httpInterceptor.response(response)).toBe(response);
      });

      it('should reject by response', function() {
        var response = {status: 401};
        expect(_httpInterceptor.response(response).$$state.status).toBe(2);
      });

      it('should reject by responseError', function() {
        var rejection = {status: 401};
        expect(_httpInterceptor.responseError(rejection).$$state.status).toBe(2);
      });
    });
  });
}());
