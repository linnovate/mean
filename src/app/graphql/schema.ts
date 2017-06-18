//  This file was automatically generated and should not be edited.
/* tslint:disable */

export interface AddUserMutationVariables {
  firstName: string;
  lastName: string;
}

export interface AddUserMutation {
  addUser: {
    title: string
  }
}


export interface UsersQueryVariables {
  title: string | null;
}

export interface UsersQuery {
  posts: Array< {
    title: string | null,
  } > | null;
}

export interface deleteQuery {
  
}
export interface updateQuery {
}
/* tslint:enable */