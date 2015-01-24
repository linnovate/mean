'use strict';

angular.module('mean.users').factory('MeanUser', [ '$rootScope', '$http', '$location', '$window', '$stateParams', 'Global',
	function($rootScope, $http, $location, $window, $stateParams, Global) {
		var MeanUserFactory = {};

		MeanUserFactory.name = 'users';

		MeanUserFactory.loginerror = 0;
		MeanUserFactory.usernameError = null;
		MeanUserFactory.registerError = null;
		MeanUserFactory.resetpassworderror = null;
		MeanUserFactory.validationError = null;

		MeanUserFactory.login = function (user) {
			// this is an ugly hack due to mean-admin needs
			var destination = $location.path().indexOf('/login') === -1 ? $location.absUrl() : false;
			$http.post('/login', {
					email: user.email,
					password: user.password,
					redirect: destination
				})
				.success(function(response) {
					// authentication OK
					MeanUserFactory.loginerror = 0;
					$rootScope.user = response.user;
					Global.user = response.user;
					$window.user = response.user;
					Global.authenticated = !! $rootScope.user;
					$rootScope.$emit('loggedin');
					if (response.redirect) {
						if ($window.location.href === response.redirect && response.user.roles.indexOf('admin') !== -1) {
							//This is so an admin user will get full admin page, but no need to refresh if user is not admin
							$window.location.reload();
						} else {
							$window.location = response.redirect;
						}
					} else {
						if (response.user.roles.indexOf('admin') !== -1) {
							$window.location.reload();
						}
						else {
							$location.url('/');
						}
					}
				})
				.error(function(response) {
					$location.path(response.redirect);
					MeanUserFactory.loginerror = 'Authentication failed.';
					$rootScope.$emit('loginfail');
				});
		};

		MeanUserFactory.register = function(user) {
			MeanUserFactory.usernameError = null;
			MeanUserFactory.registerError = null;
			$http.post('/register', {
				email: user.email,
				password: user.password,
				confirmPassword: user.confirmPassword,
				username: user.username,
				name: user.name
			})
				.success(function() {
					// authentication OK
					MeanUserFactory.registerError = 0;
					$rootScope.user = user;
					Global.user = $rootScope.user;
					$window.user = $rootScope.user;
					Global.authenticated = !! $rootScope.user;
					$rootScope.$emit('loggedin');
					$location.url('/');
				})
				.error(function(error) {
					// Error: authentication failed
					if (error === 'Username already taken') {
						MeanUserFactory.usernameError = error;
					} else if (error === 'Email already taken') {
						MeanUserFactory.emailError = error;
					} else MeanUserFactory.registerError = error;
					$rootScope.$emit('registerfail');
				});
		};

		MeanUserFactory.resetpassword = function(user) {
				$http.post('/reset/' + $stateParams.tokenId, {
					password: user.password,
					confirmPassword: user.confirmPassword
				})
					.success(function(response) {
						$rootScope.user = response.user;
						Global.user = response.user;
						$window.user = response.user;
						Global.authenticated = !! response.user;
						$rootScope.$emit('loggedin');
						if (response.redirect) {
							if ($window.location.href === response.redirect) {
								//This is so an admin user will get full admin page
								$window.location.reload();
							} else {
								$window.location = response.redirect;
							}
						} else {
							$location.url('/');
						}
					})
					.error(function(error) {
						if (error.msg === 'Token invalid or expired')
							MeanUserFactory.resetpassworderror = 'Could not update password as token is invalid or may have expired';
						else
							MeanUserFactory.validationError = error;
						$rootScope.$emit('resetpasswordfail');
					});
			};

		return MeanUserFactory;
	}
]);
