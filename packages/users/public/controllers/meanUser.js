'use strict';

angular.module('mean.users')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      // This object will contain list of available social buttons to authorize
      $scope.socialButtonsCounter = 0;
      $scope.global = Global;

      $http.get('/api/get-config')
        .success(function(config) {
          $scope.socialButtons = config;
        });
    }
  ])
  .controller('LoginCtrl', ['$rootScope', 'MeanUser',
    function($rootScope, MeanUser) {
      var vm = this;

      // This object will be filled by the form
      vm.user = {};
      
      vm.input = {
        type: 'password',
        placeholder: 'Password',
        confirmPlaceholder: 'Repeat Password',
        iconClass: '',
        tooltipText: 'Show password'
      };

      vm.togglePasswordVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };

      $rootScope.$on('loginfail', function(){
        vm.loginError = MeanUser.loginError;
      });

      // Register the login() function
      vm.login = function() {
        MeanUser.login(this.user);
      };
    }
  ])
  .controller('RegisterCtrl', ['$rootScope', 'MeanUser',
    function($rootScope, MeanUser) {
      var vm = this;

      vm.user = {};
      
      vm.registerForm = MeanUser.registerForm = true;

      vm.input = {
        type: 'password',
        placeholder: 'Password',
        placeholderConfirmPass: 'Repeat Password',
        iconClassConfirmPass: '',
        tooltipText: 'Show password',
        tooltipTextConfirmPass: 'Show password'
      };

      vm.togglePasswordVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholder = vm.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        vm.input.iconClass = vm.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipText = vm.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };
      vm.togglePasswordConfirmVisible = function() {
        vm.input.type = vm.input.type === 'text' ? 'password' : 'text';
        vm.input.placeholderConfirmPass = vm.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
        vm.input.iconClassConfirmPass = vm.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
        vm.input.tooltipTextConfirmPass = vm.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
      };

<<<<<<< HEAD
      $rootScope.$on('loginfail', function(){        
        vm.registerError = MeanUser.registerError;
      });

      // Register the register() function
      vm.register = function() {
        MeanUser.register(this.user);
=======
      $scope.register = function() {
        $scope.usernameError = null;
        $scope.registerError = null;
        $http.post('/api/register', {
          email: $scope.user.email,
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword,
          username: $scope.user.username,
          name: $scope.user.name
        })
          .success(function() {
            // authentication OK
            $scope.registerError = 0;
            $rootScope.user = $scope.user;
            Global.user = $rootScope.user;
            Global.authenticated = !! $rootScope.user;
            $rootScope.$emit('loggedin');
            $location.url('/');
          })
          .error(function(error) {
            // Error: authentication failed
            if (error === 'Username already taken') {
              $scope.usernameError = error;
            } else if (error === 'Email already taken') {
              $scope.emailError = error;
            } else $scope.registerError = error;
          });
>>>>>>> 0.5
      };

    }
  ])
<<<<<<< HEAD
  .controller('ForgotPasswordCtrl', ['MeanUser',
    function(MeanUser) {
      var vm = this;
      vm.user = {};      
      vm.registerForm = MeanUser.registerForm = false;
      vm.forgotpassword = function() {
        MeanUser.forgotpassword(this.user);
      };
    }
  ])
  .controller('ResetPasswordCtrl', ['MeanUser',
    function(MeanUser) {
      var vm = this;
      vm.user = {};      
      vm.registerForm = MeanUser.registerForm = false;
      vm.resetpassword = function() {
        MeanUser.resetpassword(this.user);
=======
  .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.forgotpassword = function() {
        $http.post('/api/forgot-password', {
          text: $scope.user.email
        })
          .success(function(response) {
            $scope.response = response;
          })
          .error(function(error) {
            $scope.response = error;
          });
      };
    }
  ])
  .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global',
    function($scope, $rootScope, $http, $location, $stateParams, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.resetpassword = function() {
        $http.post('/api/reset/' + $stateParams.tokenId, {
          password: $scope.user.password,
          confirmPassword: $scope.user.confirmPassword
        })
          .success(function(response) {
            $rootScope.user = response.user;
            $rootScope.$emit('loggedin');
            if (response.redirect) {
              if (window.location.href === response.redirect) {
                //This is so an admin user will get full admin page
                window.location.reload();
              } else {
                window.location = response.redirect;
              }
            } else {
              $location.url('/');
            }
          })
          .error(function(error) {
            if (error.msg === 'Token invalid or expired')
              $scope.resetpassworderror = 'Could not update password as token is invalid or may have expired';
            else
              $scope.validationError = error;
          });
>>>>>>> 0.5
      };
    }
  ]);
