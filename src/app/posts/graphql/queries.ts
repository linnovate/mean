import gql from 'graphql-tag';

export const GetPostDetailQuery= gql`
     query GetPostDetailQuery($id: ID!) {
        post(id: $id) {
            id
            title
            content
        }
    }
`;

export const GetPostsQuery = gql`
  query Posts {
    posts {
        id
        title
        content
    }
  }
`;

export const UpdatePostQuery = gql`
  query UpdatePost($id: ID!, $data: data) {
        id
        title
  }
`;