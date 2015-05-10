ngClip - Copy to clipboard using AngularJS
=======

An AngularJS simple directive that uses ZeroClipboard and updates the user's clipboard.


## How to get it ? 

#### Manual Download
Download the from [here](https://github.com/asafdav/ng-clip/releases)

#### Bower 
```
bower install zeroclipboard ng-clip
```

#### Npm
```
npm install zeroclipboard ng-clip
```

#### CDN
ng-clip is available at [cdnjs](http://www.cdnjs.com/libraries/ng-clip)


## Usage

1. Add ng-clip.js and ZeroClipboard.js to your main file (index.html)

2. Update the .swf path location using ngClipProvider
  ```javascript
    .config(['ngClipProvider', function(ngClipProvider) {
      ngClipProvider.setPath("bower_components/zeroclipboard/dist/ZeroClipboard.swf");
    }]);
  ```

3. Set `ngClipboard` as a dependency in your module
  ```javascript
  var myapp = angular.module('myapp', ['ngClipboard'])
  ```

4. Add clip-copy directive to the wanted element, example:
  ```html
  <a href="" clip-copy="getTextToCopy()" clip-click="doSomething()">Copy</a>
  ```

5. You can optionally override zeroclipboard config parameters using ngClipProvider
  ```javascript
      ngClipProvider.setConfig({
        zIndex: 50
      });
  ```

6. You can optionally specify the MIME type by providing using the `clip-copy-mime-type` attribute:
  ```html
  <a href="" clip-click"getHtmlToCopy()" clip-copy-mime-type="text/html">Copy HTML</a>
  ```
  
7. You can also optionally provide a fallback function that gets called if flash is unavailable:
  ```html
  <a href="" clip-click-fallback="fallback(copy)" clip-copy="getTextToCopy()" clip-click="doSomething()">Copy</a>
  ```

  If the fallback function is defined to accept an argument named `copy`, that argument will be populated with the text to copy.

## Examples
You can check out this live example here: http://plnkr.co/xwV5Yn 
see the examples folder for more 


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/asafdav/ng-clip/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

