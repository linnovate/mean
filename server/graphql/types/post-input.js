import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql';

export default new GraphQLInputObjectType({
  name: 'PostInput',
  fields: () => ({
    title: {type: GraphQLString},
  })
});