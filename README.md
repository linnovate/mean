# MEAN Stack

MEAN is a boilerplate that provides a nice starting point for MongoDB, Node.js, Express, and AngularJS based applications.  
It is designed to give you quick and organized way to start developing of MEAN based web apps with useful modules like mongoose and passport pre-bundled and configured.  
We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.  

## Prerequisites
* Node.js - Download and Install [Node.js](http://www.nodejs.org/).
* MongoDB - Download and Install [MongoDB](http://www.mongodb.org/) - Make sure it's running on the default port(27017).

## Additional Packages
* Express - Defined as npm module in the [package.json](package.json) file.
* Mongoose - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.
* UI Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Configuration
See the [config](config/) folder and especially the [config.js](config/config.js) file.

## Quick Install

 The quickest way to get started with MEAN is to clone the project and utilize it like this:

 Install npm dependencies:

    $ npm install

 Install bower dependencies:

    $ bower install

 Start the server:

    $ node server
 
 Then open a browser and go to:
    
    http://localhost:3000
    
## Getting Started
  We pre-included an article example, check it out:
  * [The Model](app/models/article.js) - Where we define our object schema.
  * [The Controller](app/controllers/articles.js) - Where we take care of our backend logic.
  * [NodeJS Routes](config/routes.js) - Where we define our REST service routes.
  * [AngularJs Routes](public/js/config.js) - Where we define our CRUD routes.
  * [The AngularJs Service](public/js/services/articles.js) - Where we connect to our REST service.
  * [The AngularJs Controller](public/js/controllers/articles.js) - Where we take care of  our frontend logic.
  * [The AngularJs Views Folder](public/views/articles) - Where we keep our CRUD views.



## MEAN Modules
   Mean presents a growing eco-system of MEAN based modules in the npm repository, To write (and contribute) your own MEAN based module checkout [mean-logger](https://npmjs.org/package/mean-logger) for examples.
  

## More Information

  * Visit our [Ninja's Zone](http://www.meanleanstartupmachine.com/) for extended support.
  * Visit us at [Linnovate.net](http://www.linnovate.net/).
  * Contact amos on any issue via [E-Mail](mailto:mail@amoshaviv.com), [Facebook](http://www.facebook.com/amoshaviv), or [Twitter](http://www.twitter.com/amoshaviv).

## License

(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
