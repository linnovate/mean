import {
  GraphQLNonNull,
  GraphQLID
} from 'graphql';

import postType from '../../types/post';
import postInputType from '../../types/post-input';

export default {
  type: postType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    },
    data: {
      name: 'data',
      type: postInputType
    }
  },
  resolve (root, params, { ctrl }) {
    return ctrl.post.update(params);
  }
};