'use strict';
angular.module('mean.system')
  .factory('Global', ['$q', '$http', '$timeout',
  function($q, $http, $timeout) {
    var _identity = undefined,
      _authenticated = false,
      _globals = undefined;

    function makeGlobals(userObj) {
      var globals = { authenticated: 0, isAdmin: false, user: {}};
      if (userObj && userObj.roles) {
        globals.authenticated = userObj.roles.length;
        globals.isAdmin = userObj.roles.indexOf('admin') !== -1;
        globals.user = userObj;
      }
      return globals;
    }

    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      globals: function(force) {
        var deferred = $q.defer();

        if (force === true) _globals = undefined;

        // check if we have globals already, reuse it by immediately resolving
        if (angular.isDefined(_globals)) {
          deferred.resolve(_globals);
          return deferred.promise;
        } else if (angular.isDefined(_identity)) {
          deferred.resolve(makeGlobals(_identity));
          return deferred.promise;
        }

        // attempt to read the new identity from localStorage
        // timeout to illustrate deferred resolution
        $timeout(function() {
          _globals = angular.fromJson(localStorage.getItem('globals'));
          deferred.resolve(_globals);
        }, 1000);

        return deferred.promise;
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      isAdmin: function() {
        if (!_authenticated || !_identity.roles) return false;
        return _identity.roles.indexOf('admin') > -1;
      },
      isInRole: function(role) {
        if (!_authenticated || !_identity.roles) return false;
        return _identity.roles.indexOf(role) > -1;
      },
      isInAnyRole: function(roles) {
        if (!_authenticated || !_identity.roles) return false;

        for (var i = 0; i < roles.length; i++) {
          if (this.isInRole(roles[i])) return true;
        }

        return false;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity != null;
        _globals = makeGlobals(identity);

        // we'll store the identity in localStorage for future
        if (identity) {
          localStorage.setItem('identity', angular.toJson(identity));
          localStorage.setItem('globals', angular.toJson(_globals));
        } else {
          localStorage.removeItem('identity');
          localStorage.removeItem('globals');
        }
      },
      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _identity = undefined;

        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        }

        // otherwise, retrieve the identity data from the server, update the identity object, and then resolve.
        $http.get('/api/users/me')
          .success(function(data) {
            _identity = data;
            _authenticated = true;
            deferred.resolve(_identity);
          })
          .error(function () {
            _identity = null;
            _authenticated = false;
            deferred.resolve(_identity);
          });

        // attempt to read the identity from localStorage
        // timeout to illustrate deferred resolution
        // var self = this;
        // $timeout(function() {
        //   _identity = angular.fromJson(localStorage.getItem('globals'));
        //   self.authenticate(_identity);
        //   deferred.resolve(_identity);
        // }, 1000);

        return deferred.promise;
      }
    };
  }
]);
