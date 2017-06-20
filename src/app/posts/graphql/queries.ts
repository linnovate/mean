import gql from 'graphql-tag';

export const GetPostsQuery = gql`
  query Posts {
    posts {
        id
        title
        content
    }
  }
`;