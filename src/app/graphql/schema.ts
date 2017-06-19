//  This file was automatically generated and should not be edited.
/* tslint:disable */

export interface AddUserMutationVariables {
  firstName: string;
  lastName: string;
}

export interface getPostDataByIdMutation {
  getPostDataById: {
    id:string,
    title:string | null,
    content:string | null
  }
}
export interface AddUserMutation {
  addUser: {
    title: string
  }
}
export interface UpdatePostMutation {
  updatePost: {
    id:string,
    title:string | null
  }
}

export interface DeletePostMutation {
  removePost: {
    id:string,
    title:string | null
  }
}

export interface UsersQueryVariables {
  title: string | null;
}

export interface UsersQuery {
  posts: Array<{
    title: string | null,
  }> | null;
}

export interface getPostDataByIdQuery {
    id:string,
    title:string | null,
    content:string | null
}

export interface deleteQuery {
 title: string | null,
 id:string 
}
export interface updateQuery {
  title: string | null,
 id:string 
}
/* tslint:enable */