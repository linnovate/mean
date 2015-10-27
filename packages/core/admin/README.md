# [![MEAN Logo](http://www.mean.io/img/logos/meanlogo.png)](http://mean.io/) MEAN Admin

[![Dependencies Status](https://david-dm.org/linnovate/mean-admin.png)](https://david-dm.org/linnovate/mean-admin)

Admin module for MEAN applications to manage:

- Modules list
- Bootswatch themes support
- App Settings
- User Management

## Basic Usage

  Install Package in root of your mean app:

    $ mean install mean-admin

  Add the admin role to your user:

    $ mean user <email> -a admin

  (Re)start the server:

    $ grunt

## Deployment

In order to deploy `mean-admin` to Heroku or otherwise, add the following line to `package.json` of the mean app:

    "mean-admin": "linnovate/mean-admin",

_Note: the `mean-admin` pubilshed on npm does not work with meanio. The line above will pull the module directly from GitHub._

Don't forget to add the `admin` role to the admin user. Make sure `server/config/env/production.js` is updated with the production db url, then use the `--env` flag as:

    $ mean user <email> -a admin --env production