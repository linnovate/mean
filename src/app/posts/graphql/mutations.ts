import gql from 'graphql-tag';

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
        updatePost(id: $id, data: $data) { 
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