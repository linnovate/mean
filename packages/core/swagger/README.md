# Swagger for Mean.io #

This package is really very basic but it does provide the Swagger endpoints to 
document your API.  It also hosts the Swagger-UI package which is available at 
/docs/ by default.

To get things up and running here is what you need to know:

* The models are currently only defined in the `models.js` file. Each package should
have its own /docs folder and in that you can sepcify the models.js
* Specify each service in the services.js file within the /docs of the relevent package
See examples below
## Getting the Articles Example Working ##

To use your package must depend on 'swagger'. 
* `swagger.add(__dirname);` to enable swagger support
Ensure `swagger.add` is AFTER `package.routes`

//Below is sample of models.js
```javascript
exports.models = {

  User: {
    id: 'User',
    required: ['name', 'email', 'username'],
    properties: {
      name: {
        type: 'string',
        description: 'Name of the user'
      },
      email: {
        type: 'string',
        description: 'Email used for authentication and notifications'
      },
      phone: {
        type: 'string',
        description: 'Phone number of the user'
      }

    }
  },
  Article: {
    id: 'Article',
    required: ['content'],
    properties: {
      id: {
        type: 'string',
        description: 'Unique identifier for the Article'
      },
      title: {
        type: 'string',
        description: 'Title of the article'
      },
      content: {
        type: 'string',
        description: 'content of the article'
      },
      user: {
        type: 'User',
        description: 'User that created the article'
      }

    }
  }
};

```
//Below is sample of services.js

```javascript
'use strict';

exports.load = function(swagger, parms){

    var searchParms = parms.searchableOptions;

    var list = {
        'spec': {
            description : 'Article operations',
            path : '/articles',
            method: 'GET',
            summary : 'Get all Articles',
            notes : '',
            type : 'Article',
            nickname : 'getArticles',
            produces : ['application/json'],
            params: searchParms
        }
    };

    var create = {
        'spec': {
            description : 'Device operations',
            path : '/articles',
            method: 'POST',
            summary : 'Create article',
            notes : '',
            type : 'Article',
            nickname : 'createArticle',
            produces : ['application/json'],
            parameters: [
                {
                    name: 'body',
                    description: 'Article to create.  User will be inferred by the authenticated user.',
                    required: true,
                    type: 'Article',
                    paramType: 'body',
                    allowMultiple: false
                }
            ]
        }
    };

    swagger.addGet(list)
        .addPost(create);

};


```
