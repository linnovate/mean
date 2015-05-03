'use strict';

angular.module('mean.users')
  .controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      // This object will contain list of available social buttons to authorize
      $scope.socialButtonsCounter = 0;
      $scope.global = Global;

      $http.get('/get-config')
        .success(function(config) {
          $scope.socialButtons = config;
        });
    }
  ])
  .controller('LoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global', 'MeanUser',
    function($scope, $rootScope, $http, $location, Global, MeanUser) {
      // This object will be filled by the form
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.input = {
        type: 'password',
        placeholder: 'Password',
        confirmPlaceholder: 'Repeat Password',
        iconClass: '',
        tooltipText: 'Show password'
      };

      $scope.togglePasswordVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };

      // Watch for loginfail event and update $scope.loginerror
      $rootScope.$on('loginfail', function(){
        $scope.loginerror = MeanUser.loginerror;
      });

      // Register the login() function
      $scope.login = function() {
        MeanUser.login($scope.user);
      };
    }
  ])
  .controller('RegisterCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global', 'MeanUser',
    function($scope, $rootScope, $http, $location, Global, MeanUser) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = true;
      $scope.input = {
        type: 'password',
        placeholder: 'Password',
        placeholderConfirmPass: 'Repeat Password',
        iconClassConfirmPass: '',
        tooltipText: 'Show password',
        tooltipTextConfirmPass: 'Show password'
      };
      
      $scope.usernameError = MeanUser.usernameError;
      $scope.registerError = MeanUser.registerError;
      $scope.emailError = MeanUser.emailError;

      $scope.togglePasswordVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholder = $scope.input.placeholder === 'Password' ? 'Visible Password' : 'Password';
        $scope.input.iconClass = $scope.input.iconClass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipText = $scope.input.tooltipText === 'Show password' ? 'Hide password' : 'Show password';
      };
      $scope.togglePasswordConfirmVisible = function() {
        $scope.input.type = $scope.input.type === 'text' ? 'password' : 'text';
        $scope.input.placeholderConfirmPass = $scope.input.placeholderConfirmPass === 'Repeat Password' ? 'Visible Password' : 'Repeat Password';
        $scope.input.iconClassConfirmPass = $scope.input.iconClassConfirmPass === 'icon_hide_password' ? '' : 'icon_hide_password';
        $scope.input.tooltipTextConfirmPass = $scope.input.tooltipTextConfirmPass === 'Show password' ? 'Hide password' : 'Show password';
      };
      
      // Watch for registerfail event and update error messages in $scope
      $rootScope.$on('registerfail', function(){
        $scope.usernameError = MeanUser.usernameError;
        $scope.registerError = MeanUser.registerError;
        $scope.emailError = MeanUser.emailError;
      });
      
      $rootScope.$on('loggedin', function(){
        $scope.registerError = MeanUser.registerError;
      });

      $scope.register = function (){
        MeanUser.register($scope.user);
      };
    }
  ])
  .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', 'Global',
    function($scope, $rootScope, $http, $location, Global) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      $scope.forgotpassword = function() {
        $http.post('/forgot-password', {
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
  .controller('ResetPasswordCtrl', ['$scope', '$rootScope', '$http', '$location', '$stateParams', 'Global', 'MeanUser',
    function($scope, $rootScope, $http, $location, $stateParams, Global, MeanUser) {
      $scope.user = {};
      $scope.global = Global;
      $scope.global.registerForm = false;
      
      // Watch for resetpasswordfail event and update error messages in $scope
      $rootScope.$on('resetpasswordfail', function(){
        $scope.resetpassworderror = MeanUser.resetpassworderror;
        $scope.validationError = MeanUser.validationError;
      });

      $scope.resetpassword = function() {
        MeanUser.resetpassword($scope.user);
      };
    }
  ]);
