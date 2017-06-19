import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} from 'graphql';

export default new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    title: {
      type: GraphQLString
    },

  })
});