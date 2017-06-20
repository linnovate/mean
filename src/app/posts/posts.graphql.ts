import gql from 'graphql-tag';

export interface UpdatePostInterface {
  updatePost: {
    id:string,
    title:string | null
  }
}

export interface DeletePostInterface {
  removePost: {
    id:string,
    title:string | null
  }
}

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

export const RemovePostMutation = gql`
    mutation removePost($id: ID!) {
        removePost(id: $id) {
            id
            title
        }
    }
`;

export const UpdatePostMutation = gql`
    mutation updatePost($id: ID!, $data: PostInput) { 
        updatePost(id: $id) { 
            id  
            title 
        }
    }
`;