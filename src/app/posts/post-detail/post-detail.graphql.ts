import gql from 'graphql-tag';
export interface getPostDataByIdInterface {
    id:string,
    title:string | null,
    content:string | null
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