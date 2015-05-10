/*jslint node: true */
/*global ZeroClipboard */

(function(window, angular, undefined) {
  'use strict';

  angular.module('ngClipboard', []).
    provider('ngClip', function() {
      var self = this;
      this.path = '//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf';
      return {
        setPath: function(newPath) {
         self.path = newPath;
        },
        setConfig: function(config) {
          self.config = config;
        },
        $get: function() {
          return {
            path: self.path,
            config: self.config
          };
        }
      };
    }).
    run(['ngClip', function(ngClip) {
      var config = {
        swfPath: ngClip.path,
        trustedDomains: ["*"],
        allowScriptAccess: "always",
        forceHandCursor: true,
      };
      ZeroClipboard.config(angular.extend(config,ngClip.config || {}));
    }]).
    directive('clipCopy', ['ngClip', function (ngClip) {
      return {
        scope: {
          clipCopy: '&',
          clipClick: '&',
          clipClickFallback: '&'
        },
        restrict: 'A',
        link: function (scope, element, attrs) {
          // Bind a fallback function if flash is unavailable
          if (ZeroClipboard.isFlashUnusable()) {
            element.bind('click', function($event) {
              // Execute the expression with local variables `$event` and `copy`
              scope.$apply(scope.clipClickFallback({
                $event: $event,
                copy: scope.$eval(scope.clipCopy)
              }));
            });

            return;
          }

          // Create the client object
          var client = new ZeroClipboard(element);
          if (attrs.clipCopy === "") {
            scope.clipCopy = function(scope) {
              return element[0].previousElementSibling.innerText;
            };
          }
          client.on( 'ready', function(readyEvent) {

            client.on('copy', function (event) {
              var clipboard = event.clipboardData;
              clipboard.setData(attrs.clipCopyMimeType || 'text/plain', scope.$eval(scope.clipCopy));
            });

            client.on( 'aftercopy', function(event) {
              if (angular.isDefined(attrs.clipClick)) {
                scope.$apply(scope.clipClick);
              }
            });

            scope.$on('$destroy', function() {
              client.destroy();
            });
          });
        }
      };
    }]);
})(window, window.angular);
