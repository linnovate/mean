'use strict';

// Setting up route
angular.module('mean.meanStarter').config(['$meanStateProvider',
  function ($meanStateProvider) {
    // states for users
    $meanStateProvider
      .state('auth', {
        url: '/auth',
        abstract: true,
        templateUrl: 'meanStarter/views/users/index.html'
      })
      .state('auth.login', {
        url: '/login',
        templateUrl: 'meanStarter/views/users/login.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'meanStarter/views/users/register.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('forgot-password', {
        url: '/forgot-password',
        templateUrl: 'meanStarter/views/users/forgot-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      })
      .state('reset-password', {
        url: '/reset/:tokenId',
        templateUrl: 'meanStarter/views/users/reset-password.html',
        resolve: {
          loggedin: function (MeanUser) {
            return MeanUser.checkLoggedOut()
          }
        }
      });
  }
]);
