# MEAN.io

MEAN is a framework that provides a easy starting point for [MongoDB](http://www.mongodb.org/), [Node.js](http://www.nodejs.org/), [Express](http://expressjs.com/), and [AngularJS](http://angularjs.org/) based applications. It is designed to give you a quick and organized way to start developing MEAN based web apps with useful modules like Mongoose and Passport pre-bundled and configured. We mainly try to take care of the connection points between existing popular frameworks and solve common integration problems.
## Prerequisites
* *MongoDB* - <a href="http://www.mongodb.org/downloads">Download</a> and Install mongodb - <a href="http://docs.mongodb.org/manual">Checkout their manual</a> if you're just starting.
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Iמstall Node.js, codeschool has free <a href="https://www.codeschool.com/courses/real-time-web-with-node-js">node</a> and <a href="https://www.codeschool.com/courses/shaping-up-with-angular-js">angular</a> tutorials.
* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.
* Grunt - Download and Install [Grunt](http://gruntjs.com).
```
$ npm install -g grunt-cli
```

## Installation
To start with MEAN install the `mean-cli` package from NPM.
This will add the *mean* command which lets you interact (install, manage, update ...) your mean based  application.

### Install the MEAN CLI

```bash
  $ sudo npm install -g mean-cli
  $ mean init <myApp>
  $ cd <myApp> && npm install
```

### Invoke node with Grunt
We recommend using [Grunt](https://github.com/gruntjs/grunt-cli) to start the server:
```bash
  $ grunt
```
If grunt aborts because of JSHINT errors, these can be overridden with the `force` flag:
```bash
  $ grunt -f
```
Alternatively, when not using `grunt` (and for production environments) you can run:
```bash
  $ node server
```
Then, open a browser and go to:
```bash
  http://localhost:3000
```
### Troubleshooting
During installation depending on your os and prerequiste versions you may encounter some issues.

Most issues can be solved by one of the following tips, but if are unable to find a solution feel free to contact us via the repository issue tracker or the links provided below.

#### Update NPM, Bower or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*. Usually updating those tools to the latest version solves the issue.

* Updating NPM:
```bash
$ npm update -g npm
```
* Updating Grunt:
```bash
$ npm update -g grunt-cli
```
* Updating Bower:
```bash
$ npm update -g bower
```

#### Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

* NPM Clean Cache:
```bash
$ npm cache clean
```

* Bower Clean Cache:
```bash
$ bower cache clean
```

#### Installation problems on Windows 8 / 8.1
Some of Mean.io dependencies uses [node-gyp](https://github.com/TooTallNate/node-gyp) with supported Python version 2.7.x. So if you see an error related to node-gyp rebuild follow next steps:

1. install [Python 2.7.x](https://www.python.org/downloads/)
2. install [Microsoft Visual Studio C++ 2012 Express](http://www.microsoft.com/ru-ru/download/details.aspx?id=34673)
3. Run NPM update
```bash
$ npm update -g
```

## Technologies

### The MEAN stack

MEAN is an acronym for *M*ongo, *E*xpress.js , *A*ngular.js and *N* ode.js

<dl class="dl-horizontal">
<dt>MongoDB</dt>
<dd>Go through MongoDB Official Website and proceed to its Great Manual, which should help you understand NoSQL and MongoDB better.</dd>
<dt>Express</dt>
<dd>The best way to understand express is through its Official Website, particularly The Express Guide; you can also go through this StackOverflow Thread for more resources.</dd>
<dt>AngularJS</dt>
<dd>Angular's Official Website is a great starting point. CodeSchool and google created a <a href="https://www.codeschool.com/courses/shaping-up-with-angular-js">great tutorial</a> for beginners., and the angular videos by <a href="https://egghead.io/">Egghead</a>.</dd>
<dt>Node.js</dt>
<dd>Start by going through Node.js Official Website and this StackOverflow Thread, which should get you going with the Node.js platform in no time.</dd>
</dl>

### Additional Tools
* <a href="http://mongoosejs.com/">Mongoose</a> - The mongodb node.js driver in charge of providing elegant mongodb object modeling for node.js
* <a href="http://passportjs.org/">Passport</a> - An authentication middleware for Node.js which supports authentication using a username and password, Facebook, Twitter, and more.
* <a href="http://getbootstrap.com/">Twitter Bootstrap</a> - The most popular HTML, CSS, and JS framework for developing responsive, mobile first projects.
* <a href="http://angular-ui.github.io/bootstrap/">UI Bootstrap</a> - Bootstrap components written in pure AngularJS
[![Build Status](https://travis-ci.org/linnovate/mean.svg?branch=master)](https://travis-ci.org/linnovate/mean)
[![Dependencies Status](https://david-dm.org/linnovate/mean.svg)](https://david-dm.org/linnovate/mean)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## CLI
### Overview

The MEAN CLI is a simple Command Line Interface for installing and managing MEAN applications. As a core module of the mean.io project, it provides a number of useful tools to make interaction with your MEAN application easier, with features such as: scaffolding, module creation and admin, status checks, and user management.
```bash
  $ mean
  $ mean --help
  $ mean help
```
  <code>mean help</code> can also be used in conjunction with any command to get more information about that particular functionality. For example, try <code>mean help init</code> to see the options for init
```bash
  $ mean help [command]
```
### Users

 <p>Information can be display for a specific customer via <code>mean user email</code>. Email is required. User roles can be assigned or removed with the <code>--addRole (or -a)</code> and <code>--removeRole (or -r)</code> options, respectively.
  <p>For example, the <i>admin</i> role is required to edit tokens.</p>
```bash
  $ mean user <email>
  $ mean user <email> --addRole <role>;
  $ mean user <email> --removeRole <role>;
```

### packages
#### Management
 <p class="alert alert-warning">All of the remaining of the commands must be run from the root folder of your MEAN application.</p>
  <p>Contributed MEAN packages can be installed or uninstalled via the CLI. Also, currently installed modules can be viewed with the <code>list</code> command.</p>
```bash
  $ mean list
  $ mean install <module>
  $ mean uninstall <module>
```

  <p class="alert alert-info">Mean packages installed via the installer are found in <i>/node_modules</i></p>
#### Search
To find new packages run the *mean search* command
```bash
  $ mean search [packagename]
```
mean search will return all of the available packages, mean search packagename will filter the search results.

#### Scaffolding
To create a new MEAN app, run <code>mean init</code>. Name for the application is optional. If no name is provided, "mean" is used. The MEAN project will be cloned from GitHub into a directory of the application name.
```bash
  $ mean init [name]
  $ cd [name] && npm install
```
  <p class="alert alert-info">Note: <a href="http://git-scm.com/downloads">git</a> must be installed for this command to work properly.</p>

### Misc
<h4>Status</h4>
<p>Check the database connection for a particular environment (e.g. development (default), test, production) and make sure that the meanio command line version is up to date.</p>
```bash
  $ mean status
```
<h4>Docs</h4>
<p>A simple shortcut to open the mean documentation in your default browser.</p>
```bash
  $ mean docs
```

## Packages

Everything in mean.io is a package and when extending mean with custom functionality make sure you create your own package and do not alter the core packages.

The mean.io package system allows developers to create modular code that provides useful tools that other mean developers can use. The packages, when published, are plug-and-play and are used in a way very similar to traditional npm packages.

The meanio package system integrates all the packages into the mean project as if the code was part of mean itself and provides the developers with all the necceesary tools required to integrate their package into the host project.

There are two types of packages:

**Custom Packages** are generated by the mean scaffolder and contain most of your application logic. Custom packages are found in /packages/custom and can be published as a contrib package for use by other developers.

**Contrib Packages** are installed by the mean installer and are found at /packages/contrib. Contrib packages are "plug and play".

### Core Packages

All `Core` packages can be overridden by other packages allowing you to extend and adapt it to fit your specific needs. See `overriding core packages` for detailed examples


#### System
The system package creates the basic pages as well as defines the layout of the site and integrates the menu into the page. The system package also allows us to define things such as rendering engines, static files and routing on the client and server side.
#### Users
The users package creates the database model of the user, provides validation as well as various login and registration features.
#### Access
The access package managers permissions and middleware. It controls the various authentication methods and is dependent on the users package
#### Theme
The theme package adds some basic CSS and other assets such as images and backgrounds
#### Articles
Articles package is typically used as an example, starting point for managing content that might be used in a blog or cms. The full CRUD is implemented on the server and client.
### Files structure
The file structure is similar to that of the mean project itself

`Fundamental` Files at the `root` of the package

**Server**

Packages are registered in the **app.js** 
Defines package name, version and `mean=true` in the **package.json**   

All of the Server side code resides in the `/server` directory.

  

    Server
    --- config        # Configuration files
    --- controllers   # Server side logic goes here
    --- models        # Database Schema Models
    --- routes        # Rest api endpoints for routing
    --- views         # Swig based html rendering

**Client**

All of the Client side code resides in the `/public` directory.

    public            
    --- assets        # Javascript/Css/Images (not aggregated)
    --- controllers   # Angular Controllers
    --- config        # Contains routing files
    --- services      # Angular Services (also directive and filter folders)
    --- views         # Angular views

All javascript within public is automatically aggregated with the exception of files in assets which can be manually added using the `aggregateAsset()` function

Files within public of the package can be accessed externally `/[package-name]/path-to-file-relative-to-public` for example to access tokens angular controller tokens/controllers/tokens.js


### Creating your own package
To create your own package and scaffold it's initial code - run
```bash
mean package <packageName>
```
This will create a package under */packages/custom/pkgName*
### Contributing you package
### Config
All the configuration is specified in the [config](/config/) folder,
through the [env](config/env/) files, and is orchestrated through the [meanio](https://github.com/linnovate/meanio) NPM module.
Here you will need to specify your application name, database name, and hook up any social app keys if you want integration with Twitter, Facebook, GitHub, or Google.

### Environmental Settings

There is a shared environment config: __all__

* __root__ - This the default root path for the application.
* __port__ - DEPRECATED to __http.port__ or __https.port__.
* __http.port__ - This sets the default application port.
* __https__ - These settings are for running HTTPS / SSL for a secure application.
* __port__ - This sets the default application port for HTTPS / SSL. If HTTPS is not used then is value is to be set to __false__ which is the default setting. If HTTPS is to be used the standard HTTPS port is __443__.
* __ssl.key__ - The path to public key.
* __ssl.cert__ - The path to certificate.

There are three environments provided by default: __development__, __test__, and __production__.
Each of these environments has the following configuration options:

* __db__ - This is where you specify the MongoDB / Mongoose settings
* __url__ - This is the url/name of the MongoDB database to use, and is set by default to __mean-dev__ for the development environment.
* __debug__ - Setting this option to __true__ will log the output all Mongoose executed collection methods to your console.  The default is set to __true__ for the development environment.
* __options__ - These are the database options that will be passed directly to mongoose.connect in the __production__ environment: [server, replset, user, pass, auth, mongos] (http://mongoosejs.com/docs/connections.html#options) or read [this] (http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options) for more information.
* __app.name__ - This is the name of your app or website, and can be different for each environment. You can tell which environment you are running by looking at the TITLE attribute that your app generates.
* __Social OAuth Keys__ - Facebook, GitHub, Google, Twitter. You can specify your own social application keys here for each platform:
  * __clientID__
  * __clientSecret__
  * __callbackURL__
* __emailFrom__ - This is the from email address displayed when sending an email.
* __mailer__ - This is where you enter your email service provider, username and password.

To run with a different environment, just specify NODE_ENV as you call grunt:
```bash
    $ NODE_ENV=test grunt
```
If you are using node instead of grunt, it is very similar:
```bash
    $ NODE_ENV=test node server
```
To simply run tests
```bash
    $ npm test
```
> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

## Staying up to date
After initializing a project, you'll see that the root directory of your project is already a git repository. MEAN uses git to download and update its own code. To handle its own operations, MEAN creates a remote called `upstream`. This way you can use git as you would in any other project.

To maintain your own public or private repository, add your repository as remote. See here for information on [adding an existing project to GitHub](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line).

```bash
git remote add origin <remote repository URL>
git push -u origin master
```


## Hosting MEAN

### Heroku
Before you start make sure you have the [Heroku toolbelt](https://toolbelt.heroku.com/)
installed and an accessible MongoDB instance - you can try [MongoHQ](http://www.mongohq.com/)
which has an easy setup).

Add the db string to the production env in server/config/env/production.js.

```bash
git init
git add .
git commit -m "initial version"
heroku apps:create
heroku config:add NODE_ENV=production
heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
git push heroku master
heroku config:set NODE_ENV=production
```

### OpenShift

1. Register for an account on Openshift (http://www.openshift.com).
1. Create an app on Openshift by choosing a 'Node' type site to create. Create the site by making Openshift use Linnovate's Openshift git repo as its source code (https://github.com/linnovate/mean-on-openshift.git)
1. On the second screen after the new application has been created, add a Mongo database
1. When the site has been built, you can visit it on your newly created domain, which will look like my-domain.openshift.com. You may need to restart the instance on Openshift before you can see it. It will look like Mean.io boilerplate.
1. On your new app's console page on Openshift, make a note of the git repo where the code lives. Clone that repo to your local computer where your mean.io app codebase is.
1. Merge your completed local app into this new repo. You will have some conflicts, so merge carefully, line by line.
1. Commit and push the repo with the Openshift code back up to Openshift. Restart your instance on Openshift, you should see your site!


## More Information
  * Visit us at [Linnovate.net](http://www.linnovate.net/).
  * Visit our [Ninja's Zone](http://www.meanleanstartupmachine.com/) for extended support.

## Cedits
  * <a href="https://github.com/vkarpov15">Valeri Karpov</a> for coining the term *mean* and triggering the mean stack movement.
  * <a href="https://github.com/amoshaviv">Amos Haviv</a>  for the creation of the initial version of mean.io while working for us @linnovate.
  * <a href="https://github.com/madhums/">Madhusudhan Srinivasa</a> which inspired us with his great work.

## License
We belive that mean should be free and easy to integrate within your existing projects so we chose the [The MIT License](http://opensource.org/licenses/MIT)
