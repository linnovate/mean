import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { DeletePostInterface, UpdatePostInterface, PostsInterface } from '../graphql/schema';
import { GetPostsQuery } from '../graphql/queries';
import { RemovePostMutation, UpdatePostMutation } from '../graphql/mutations';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  // Observable with GraphQL result
  public posts: ApolloQueryObservable<PostsInterface>;
  public listPostFilter:string;
  public postControl = new FormControl();
  // Observable variable of the graphql query
  public nameFilter: Subject<string> = new Subject<string>();
  private apollo: Apollo;

  // Inject Angular2Apollo service
  constructor(apollo: Apollo) {
    this.apollo = apollo;
  }

  public ngOnInit() {
    // Query posts data with observable variables
    this.posts = this.apollo.watchQuery<PostsInterface>({
      query: GetPostsQuery,
    })
      // Return only posts, not the whole ApolloQueryResult
      .map(result => result.data.posts) as any;

    // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
    this.postControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
   
  }
  public deletePost(id:string){
 // Call the mutation called deletePost
    this.apollo.mutate<DeletePostInterface>({
      mutation: RemovePostMutation,
      variables: {
      "id": id
      },
    })
      .take(1)
      .subscribe({
        next: ({data}) => {
          console.log('delete post', data.removePost);
          // get new data
          this.posts.refetch();
        },
        error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }
  public editPost(id:string){
    debugger;
  this.apollo.mutate<UpdatePostInterface>({
      mutation: UpdatePostMutation,
      variables: {
      "id": id
      },
    })
      .take(1)
      .subscribe({
        next: ({data}) => {
          console.log('update post', data.updatePost);

          // get new data
          this.posts.refetch();
        },
        error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }
}