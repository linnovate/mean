# angular-jwt

This library will help you work with [JWTs](http://jwt.io/).

## Key Features

* **Decode a JWT** from your AngularJS app
* Check the **expiration date** of the JWT
* Automatically **send the JWT in every request** made to the server
* Use **refresh tokens to always send a not expired JWT** to the server

## Installing it

You have several options:

````bash
bower install angular-jwt
````

````bash
npm install angular-jwt
````

````html
<script type="text/javascript" src="https://cdn.rawgit.com/auth0/angular-jwt/master/dist/angular-jwt.js"></script>
````

## jwtHelper

jwtHelper will take care of helping you decode the token and check its expiration date.

### Decoding the token

````js
angular.module('app', ['angular-jwt'])
.controller('Controller', function Controller(jwtHelper) {
  var expToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6ImZhY2Vib29rfDEwMTU0Mjg3MDI3NTEwMzAyIiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MTIyMzQ3MzAsImlhdCI6MTQxMjE5ODczMH0.7M5sAV50fF1-_h9qVbdSgqAnXVF7mz3I6RjS6JiH0H8';  

  var tokenPayload = jwtHelper.decodeToken(expToken);
})
````
### Getting the token expiration date

````js
angular.module('app', ['angular-jwt'])
.controller('Controller', function Controller(jwtHelper) {
  var date = jwtHelper.getTokenExpirationDate(expToken);
})
````

### Checking if token is expired

````js
angular.module('app', ['angular-jwt'])
.controller('Controller', function Controller(jwtHelper) {
  var bool = jwtHelper.isTokenExpired(expToken);
})
````

### More examples

You can see some more examples of how this works in [the tests](https://github.com/auth0/angular-jwt/blob/master/test/unit/angularJwt/services/jwtSpec.js)

## jwtInterceptor

JWT interceptor will take care of sending the JWT in every request.

### Basic usage

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    myService.doSomething();
    return localStorage.getItem('id_token');
  }];
  
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // If localStorage contains the id_token it will be sent in the request
  // Authorization: Bearer [yourToken] will be sent
  $http({
    url: '/hola',
    method: 'GET'
  });
})
````

### Not sending the JWT for specific requests

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  // Please note we're annotating the function so that the $injector works when the file is minified
  jwtInterceptorProvider.tokenGetter = ['myService', function(myService) {
    myService.doSomething();
    return localStorage.getItem('id_token');
  }];
  
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // This request will NOT send the token as it has skipAuthentication
  $http({
    url: '/hola',
    skipAuthorization: true
    method: 'GET'
  });
})
````

### Not sending the JWT for template requests

By default the interceptor will send the JWT for all HTTP requests. This includes any `ng-include` directives or 
`templateUrls` defined in a `state` in the `stateProvider`. If you want to avoid sending the JWT for these requests you
should adapt your `tokenGetter` method to fit your needs. For example:

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['config', function(config) {
    // Skip authentication for any requests ending in .html
    if (config.url.substr(config.url.length - 5) == '.html') {
      return null;
    }
    
    return localStorage.getItem('id_token');
  }];
  
  $httpProvider.interceptors.push('jwtInterceptor');
})
````

### Sending different tokens based on URLs

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function(config) {
    if (config.url.indexOf('http://auth0.com') === 0) {
      return localStorage.getItem('auth0.id_token');
    } else {
      return localStorage.getItem('id_token');
    }
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // This request will send the auth0.id_token since URL matches
  $http({
    url: 'http://auth0.com/hola',
    skipAuthorization: true
    method: 'GET'
  });
}
````

### Using promises on the `tokenGetter`: Refresh Token example

As sometimes we need to get first the `id_token` in order to send it, we can return a promise in the `tokenGetter`. Let's see for example how we'd use a `refresh_token`

````js
angular.module('app', ['angular-jwt'])
.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = function(jwtHelper, $http) {
    var idToken = localStorage.getItem('id_token');
    var refreshToken = localStorage.getItem('refresh_token');
    if (jwtHelper.isTokenExpired(idToken)) {
      // This is a promise of a JWT id_token
      return $http({
        url: '/delegation',
        // This makes it so that this request doesn't send the JWT
        skipAuthorization: true,
        method: 'POST',
        data: { 
            grant_type: 'refresh_token',
            refresh_token: refreshToken 
        }
      }).then(function(response) {
        var id_token = response.data.id_token;
        localStorage.setItem('id_token', id_token);
        return id_token;
      });
    } else {
      return idToken;
    }
  }
  $httpProvider.interceptors.push('jwtInterceptor');
})
.controller('Controller', function Controller($http) {
  // Authorization: Bearer [yourToken] will be sent. 
  // That token might be a new one which was got from the refresh token
  $http({
    url: '/hola',
    method: 'GET'
  });
})
````

### More examples

You can see some more examples of how this works in [the tests](https://github.com/auth0/angular-jwt/blob/master/test/unit/angularJwt/services/interceptorSpec.js)

## FAQ

### I have minification problems with angular-jwt in production. What's going on?

When you're using the `tokenGetter` function, it's then called with the injector. `ngAnnotate` doesn't automatically detect that this function receives services as parameters, therefore you must either annotate this method for `ngAnnotate` to know, or use it like follows: 

````js
jwtInterceptorProvider.tokenGetter = ['store', '$http', function(store, $http) {
  ...
}];
````

## Usages

This library is used in [auth0-angular](https://github.com/auth0/auth0-angular)

## Contributing

Just clone the repo, run `npm install`, `bower install` and then `gulp` to work :).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.



