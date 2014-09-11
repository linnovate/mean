# [![MEAN Logo](http://www.mean.io/img/logos/meanlogo.png)](http://mean.io/) MEAN Command Line

[![NPM version](https://badge.fury.io/js/meanio.svg)](http://badge.fury.io/js/meanio)
[![Dependency Status](https://david-dm.org/linnovate/mean-cli.svg)](https://david-dm.org/linnovate/mean-cli)

Source for npm package meanio. mean-cli is a core package of the mean.io project and is used primarily to manage packages for extending functionality, for example adding a package to enable inline editable tokens. 

The cli provides a lot of useful functionality, such as scaffolding options to ceate new packages, assign roles to users, check the mongo status, add/remove packages and list currently installed packages.

See http://mean.io/#!/docs for more in-depth information about mean.

## The repository contains
* The bin file used for cli operations.
* Core functionality for managing mean packages.

## Basic Usage

  Install Package:

    $ [sudo] npm install -g mean-cli

  Explore CLI functionality:

    $ mean --help

  Create a new mean app:

    $ mean init <NameOfYourApp>

  Install Dependencies:

    $ cd <NameOfYourApp> && npm install

  Create a sample mean package:

    $ mean package <NameOfYourPackage>

  Run your app:

    $ grunt
