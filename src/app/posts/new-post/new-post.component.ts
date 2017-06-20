import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { DocumentNode } from 'graphql';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';

import { GetPostsQuery, AddPostMutation, PostsInterface } from './new-post.graphql.ts';


@Component({
  selector: 'new-post',
  // moduleId:module.id,
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  public firstName: string;
  public lastName: string;

  form: FormGroup;
  title: string;
  content:string;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apollo: Apollo
  ) {
    this.form = formBuilder.group({
      title: ['', [
        Validators.required,
      ]],
      content: ['']
    });
    this.apollo = apollo;
  }
  public save() {
    this.apollo.mutate({
      mutation: AddPostMutation,
      variables: {
        "data": {
          "title": this.title,
          "content" :this.content
        }
      },
      refetchQueries: [{
        query: GetPostsQuery,
      }],
    })
    .take(1)
      .subscribe({
        next: ({ data }) => {
          console.log('got a new post', data);
          // get new data      
          this.router.navigate(['/posts']);
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }
}
