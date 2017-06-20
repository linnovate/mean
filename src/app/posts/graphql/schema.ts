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
    content: string | null
  }> | null;
}

export interface PostByIdInterface {
    id:string,
    title:string | null,
    content:string | null
}