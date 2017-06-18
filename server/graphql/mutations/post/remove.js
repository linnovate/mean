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
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve (root, params, { ctrl }) {
    return ctrl.post.remove(params);
  }
};