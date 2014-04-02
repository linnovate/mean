# Mean Command Line


Source for npm package meanio. mean-cli is a core package of the mean.io project and is used primarily to manage packages used for extending functionality such as for example adding a package to enable inline editable tokens. 

The cli provides a lot of useful functionality as well as scaffolding options to ceate new packages, assign roles to users, check the mongo status add/remove packages and list currently installed packages

FULL Documentation to be included in version 0.3.2 of the http://mean.io project.


See http://mean.io for more indepth information about mean.

## The repository contains
* The bin file used for cli operations.
* Core functionality for managing mean packages.

## Basic Usage

  Install Package:

    $ sudo npm install -g meanio

  Explore CLI function:

    $ mean --help
    
  Create a new mean app:

    $ mean init <NameOfYourApp>
    
  Install Dependencies:

    $ cd <NameOfYourApp> && npm install
    
  Create a sample mean package:

    $ mean package <NameOfYourPackage>

  Run your app:

    $ grunt
