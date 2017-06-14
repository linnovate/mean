import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import postType from '../../types/post';
import getProjection from '../../get-projection';
import Post from '../../../server/models/post.model';

export default {
  type: postType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve (root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);
    const removedPost = await Post
      .findByIdAndRemove(params._id, {
        select: projection
      })
      .exec();

    if (!removedBlogPost) {
      throw new Error('Error removing post');
    }

    return removedBlogPost;
  }
};