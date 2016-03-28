'use strict';

angular.module('mean.users').factory('MeanUser', [ '$rootScope', '$http', '$location', '$stateParams', '$cookies', '$q', '$timeout', '$meanConfig',
  function($rootScope, $http, $location, $stateParams, $cookies, $q, $timeout, $meanConfig) {

    var self;

    function escape(html) {
      return String(html)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    function b64_to_utf8( str ) {
      return decodeURIComponent(escape(window.atob( str )));
    }

    /*function url_base64_decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
      case 0:
      break;
      case 2:
      output += '==';
      break;
      case 3:
      output += '=';
      break;
      default:
      throw 'Illegal base64url string!';
      }
      return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
    }*/

    function MeanUserKlass(){
      this.aclDefer = $q.defer();
      this.name = 'users';
      this.user = {};
      this.acl = this.aclDefer.promise;
      this.registerForm = false;
      this.loggedin = false;
      this.isAdmin = false;
      this.loginError = 0;
      this.usernameError = null;
      this.registerError = null;
      this.resetpassworderror = null;
      this.validationError = null;
      self = this;
      $http.get('/api/users/me').success(function(response) {
        if(!response && $cookies.get('token') && $cookies.get('redirect')) {
          self.onIdentity.bind(self)({
            token: $cookies.get('token'),
            redirect: $cookies.get('redirect').replace(/^"|"$/g, '')
          });
          $cookies.remove('token');
          $cookies.remove('redirect');
        } else {
          self.onIdentity.bind(self)(response);
        }
      });
      this.acl.then(function(response) {
        self.acl = response;
        delete self.aclDefer;
      });
    }

    MeanUserKlass.prototype.onIdentity = function(response) {
      var self = this;

      if (!response) {
        $http.get('/api/circles/mine').success(function(acl) {
          if(self.aclDefer) {
            self.aclDefer.resolve(acl);
          } else {
            self.acl = acl;
          }
        });
        return;
      }
      var encodedUser, user, destination;
      if (angular.isDefined(response.token)) {
        localStorage.setItem('JWT', response.token);
        encodedUser = decodeURI(b64_to_utf8(response.token.split('.')[1]));
        user = JSON.parse(encodedUser);
      }
      destination = angular.isDefined(response.redirect) ? response.redirect : destination;
      $cookies.remove('redirect');
      this.user = user || response;
      this.loggedin = true;
      this.loginError = 0;
      this.registerError = 0;
      this.isAdmin = this.user.roles.indexOf('admin') > -1;
      var userObj = this.user;
      // Add circles info to user
      $http.get('/api/circles/mine').success(function(acl) {
        if(self.aclDefer) {
          self.aclDefer.resolve(acl);
        } else {
          self.acl = acl;
        }
        if (destination) {
          $location.path(destination);
        }
        $rootScope.$emit('loggedin', userObj);
      });
    };

    MeanUserKlass.prototype.onIdFail = function (response) {
      $location.path(response.redirect);
      this.loginError = 'Authentication failed.';
      this.registerError = response;
      this.validationError = response.msg;
      this.resetpassworderror = response.msg;
      $rootScope.$emit('loginfailed');
      $rootScope.$emit('registerfailed');
    };

    var MeanUser = new MeanUserKlass();

    MeanUserKlass.prototype.login = function (user) {
      // this is an ugly hack due to mean-admin needs
      var destination = $location.path().indexOf('/login') === -1 ? $location.absUrl() : false;
      $http.post('/api/login', {
          email: user.email,
          password: user.password,
          redirect: $cookies.get('redirect') || destination
        })
        .success(this.onIdentity.bind(this))
        .error(this.onIdFail.bind(this));
    };

    MeanUserKlass.prototype.register = function(user) {
      $http.post('/api/register', {
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
        username: user.username,
        name: user.name
      })
        .success(this.onIdentity.bind(this))
        .error(this.onIdFail.bind(this));
    };

    MeanUserKlass.prototype.resetpassword = function(user) {
        $http.post('/api/reset/' + $stateParams.tokenId, {
          password: user.password,
          confirmPassword: user.confirmPassword
        })
          .success(this.onIdentity.bind(this))
          .error(this.onIdFail.bind(this));
      };

    MeanUserKlass.prototype.forgotpassword = function(user) {
        $http.post('/api/forgot-password', {
          text: user.email
        })
          .success(function(response) {
            $rootScope.$emit('forgotmailsent', response);
          })
          .error(this.onIdFail.bind(this));
      };

    MeanUserKlass.prototype.logout = function(){
      this.user = {};
      this.loggedin = false;
      this.isAdmin = false;

      $http.get('/api/logout').success(function(data) {
        localStorage.removeItem('JWT');
        $rootScope.$emit('logout');
      });
    };

    MeanUserKlass.prototype.checkLoggedin = function() {
     var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $cookies.put('redirect', $location.path());
          $timeout(deferred.reject);
          $location.url($meanConfig.loginPage);
        }
      });

      return deferred.promise;
    };

    MeanUserKlass.prototype.checkLoggedOut = function() {
       // Check if the user is not connected
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') {
          $timeout(deferred.reject);
          $location.url('/');
        }
        // Not Authenticated
        else $timeout(deferred.resolve);
      });

      return deferred.promise;
    };

    MeanUserKlass.prototype.checkAdmin = function() {
     var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/api/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0' && user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve);

        // Not Authenticated or not Admin
        else {
          $timeout(deferred.reject);
          $location.url('/');
        }
      });

      return deferred.promise;
    };

    return MeanUser;
  }
]);
