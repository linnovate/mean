import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';
import { client } from '../graphql.client';


import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AddUserMutation,DeletePostMutation,UpdatePostMutation,UsersQuery,deleteQuery,updateQuery } from '../graphql/schema';
const UsersQueryNode: DocumentNode = require('graphql-tag/loader!../graphql/Users.graphql');
const DeletePostMutationNode: DocumentNode = require('graphql-tag/loader!../graphql/DeletePost.graphql');
const UpdatePostMutationNode: DocumentNode = require('graphql-tag/loader!../graphql/UpdatePost.graphql');

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  // Observable with GraphQL result
  public posts: ApolloQueryObservable<UsersQuery>;
  public firstName: string;
  public lastName: string;
  public listPostFilter:string;
  public nameControl = new FormControl();
  // Observable variable of the graphql query
  public nameFilter: Subject<string> = new Subject<string>();
  private apollo: Apollo;

  // Inject Angular2Apollo service
  constructor(apollo: Apollo) {
    this.apollo = apollo;
  }

  public ngOnInit() {
    // Query users data with observable variables
    this.posts = this.apollo.watchQuery<UsersQuery>({
      query: UsersQueryNode,
    })
      // Return only users, not the whole ApolloQueryResult
      .map(result => result.data.posts) as any;

    // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
    this.nameControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
   
  }

  // public ngAfterViewInit() {
  //   // Set nameFilter to null after NgOnInit happend and the view has been initated
  //   this.nameFilter.next(null);
  // }

 
  public addNewPost(){
    //open modal or something else...
  //meantime go to posts/new. 
  }
  public deletePost(id:string){
    debugger;
 // Call the mutation called deletePost
    this.apollo.mutate<DeletePostMutation>({
      mutation: DeletePostMutationNode,
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
  this.apollo.mutate<UpdatePostMutation>({
      mutation: UpdatePostMutationNode,
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