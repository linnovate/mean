'use strict';

angular.module('mean.users').factory('MeanUser', [ '$rootScope', '$http', '$location',
  function($rootScope, $http, $location) {

    //this is used to parse the return token
    function url_base64_decode(str) {
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
    }

    function MeanUserKlass(){
      this.name = 'users';
      this.user = {};
      this.loggedin = false;
      this.isAdmin = false;
      this.loginError = 0;
      this.usernameError = null;
      this.registerError = null;
      this.resetpassworderror = null;
      this.validationError = null;
      //$http.get('/users/me').success(this.onIdentity.bind(this));
    }

    MeanUserKlass.prototype.onIdentity = function(response){
      this.loginError = 0;
      this.loggedin = true;
      localStorage.setItem('JWT', response.token);
      var encodedProfile = response.token.split('.')[1];      
      var payload = url_base64_decode(encodedProfile);
      this.user = payload.user;
      var destination = payload.redirect;      
      if (angular.isDefined(response) && response !== null) {        
        $rootScope.$emit('loggedin');

        if (this.user.roles.indexOf('admin') !== -1) this.isAdmin = true;
    
        if (destination) {
            $location.path(destination);
        } else {
            $location.url('/');
        }
      }
    };

    MeanUserKlass.prototype.onIdFail = function (response) {
      $location.path(response.redirect);
      this.loginError = 'Authentication failed.';
      $rootScope.$emit('loginfail');
    };

    var MeanUser = new MeanUserKlass();

    MeanUserKlass.prototype.login = function (user) {
      // this is an ugly hack due to mean-admin needs
      var destination = $location.path().indexOf('/login') === -1 ? $location.absUrl() : false;
      $http.post('/login', {
          email: user.email,
          password: user.password,
          redirect: destination
        })
        .success(this.onIdentity.bind(this))
        .error(this.onIdFail.bind(this));
    };


    return MeanUser;
  }
]);
