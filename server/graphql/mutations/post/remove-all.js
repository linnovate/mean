import {
  GraphQLBoolean
} from 'graphql';

import Post from '../../../server/models/post.model';

export default {
  type: GraphQLBoolean,
  resolve (root, params, options) {
    return Post
      .remove({})
      .exec();
  }
};