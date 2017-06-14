import {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} from 'graphql';
import {Types} from 'mongoose';

import postType from '../../types/post';
import getProjection from '../../get-projection';
import Post from '../../../server/models/post.model';

export default {
  type: postType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return Post
      .findById(params.id)
      .select(projection)
      .exec();
  }
};