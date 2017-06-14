import {
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLID
} from 'graphql';

export default new GraphQLInputObjectType({
  name: 'PostInput',
  fields: {
    _id: {type: GraphQLID},
    title: {type: GraphQLString},
  }
});