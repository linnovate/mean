import {
  GraphQLNonNull,
  GraphQLBoolean
} from 'graphql';

import postInputType from '../../types/post-input';
import Post from '../../../server/models/post.model';

export default {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(postInputType)
    }
  },
  async resolve (root, params, options) {
    const post = new Post(params.data);
    const newPost = await post.save();

    if (!newPost) {
      throw new Error('Error adding new post');
    }
    return true;
  }
};