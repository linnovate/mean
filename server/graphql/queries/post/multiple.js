import {
  GraphQLList
} from 'graphql';

import postType from '../../types/post';
import getProjection from '../../get-projection';
import Post from '../../../server/models/post.model';

export default {
  type: new GraphQLList(postType),
  args: {},
  resolve (root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return Post
      .find()
      .select(projection)
      .exec();
  }
};