exports.models = {

  Article: {
    id: 'Article',
    required: ['content', 'title'],
    properties: {
   
      title: {
        type: 'string',
        description: 'Title of the article'
      },
      content: {
        type: 'string',
        description: 'content of the article'
      },
      permissions: {
        type: 'Array',
        description: 'Permissions for viewing the article'
      }
    }
  }
};
