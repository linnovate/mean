import { Injectable } from '@angular/core';
import { IPost } from './post.interface';
import { GetPostsQuery } from './graphql/queries';
import { Subject } from 'rxjs/Subject';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { DeletePostInterface, UpdatePostInterface, PostsInterface } from './graphql/schema';
import { RemovePostMutation, UpdatePostMutation } from './graphql/mutations';

@Injectable()
export class PostsService {
    private posts: ApolloQueryObservable<PostsInterface>;
    private apollo: Apollo;

    constructor(apollo: Apollo) {
        this.apollo = apollo;
    }

    get(): ApolloQueryObservable<PostsInterface> {
        // Query posts data with observable variables
        this.posts = this.apollo.watchQuery<PostsInterface>({
            query: GetPostsQuery,
        })
            // Return only posts, not the whole ApolloQueryResult
            .map(result => result.data.posts) as any;
        return this.posts;
    }
    delete(id: string): Promise<any> {
        // Call the mutation called deletePost
        return new Promise((resolve, reject) => {
            this.apollo.mutate<DeletePostInterface>({
                mutation: RemovePostMutation,
                variables: {
                    "id": id
                },
            })
                .take(1)
                .subscribe({
                    next: ({ data }) => {
                        console.log('delete post', data.removePost);
                        // update data
                        resolve({
                            success: true,
                            message: `Post #${id} deleted successfully  `
                        });
                    },
                    error: (errors) => {
                        console.log('there was an error sending the query', errors);
                        reject({
                            success: false,
                            message: errors
                        })
                    }
                });
        });
    }


}