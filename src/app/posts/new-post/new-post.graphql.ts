import gql from 'graphql-tag';

export interface PostsInterface {
  posts: Array<{
    title: string | null,
  }> | null;
}

export const GetPostsQuery = gql`
  query Posts {
    posts {
        id
        title
        content
    }
  }
`;


export const AddPostMutation = gql`
    mutation addPost($data: PostInput!) {
    addPost(data: $data)
    }
`;