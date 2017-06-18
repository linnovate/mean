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
  resolve (root, params, { ctrl }) {
    return ctrl.post.create(params);
  }
};

