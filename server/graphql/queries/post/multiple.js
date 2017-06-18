import {
  GraphQLList,
  GraphQLInt
} from 'graphql';

import postType from '../../types/post';

export default {
  type: new GraphQLList(postType),
  args: {
    limit: {
      name: 'limit',
      type: GraphQLInt 
    },
    skip: {
      name: 'skip',
      type:GraphQLInt
    }
  },
  resolve (root, params, { ctrl }) {
    return ctrl.post.list(params)
  }
};

