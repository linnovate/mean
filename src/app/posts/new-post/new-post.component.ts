import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { DocumentNode } from 'graphql';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';

import { Post } from '../shared/post';
import { PostsService } from '../shared/posts.service';
import { AddUserMutation, UsersQuery } from '../../graphql/schema';
const UsersQueryNode: DocumentNode = require('graphql-tag/loader!../../graphql/Users.graphql');
const AddUserMutationNode: DocumentNode = require('graphql-tag/loader!../../graphql/AddUser.graphql');

//import { BasicValidators } from '../../shared/basic-validators';

@Component({
  selector: 'new-post',
  // moduleId:module.id,
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent implements OnInit {
  public posts: ApolloQueryObservable<UsersQuery>;
  public firstName: string;
  public lastName: string;

  form: FormGroup;
  title: string;
  post: Post = new Post();

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private apollo: Apollo
  ) {
    this.form = formBuilder.group({
      title: ['', [
        Validators.required,
      ]],
    });
        this.apollo = apollo;
  }

  ngOnInit() {
    var id = this.route.params.subscribe(params => {
      var id = params['id'];

     //  this.title = id ? 'Edit Post' : 'New Post';

      if (!id)
        return;

      this.postsService.getPost(id)
        .subscribe(
          post => this.post = post,
          response => {
            if (response.status == 404) {
              this.router.navigate(['NotFound']);
            }
          });
    });
  }

   public save() {
    this.apollo.mutate({
          mutation: AddUserMutationNode,
          variables: {
            "data": {
              "title": this.title
            }
          }
        }).subscribe(({ data }) => {
          console.log('got data', data, this.posts);
        },(error) => {
          console.log('there was an error sending the query', error);
        })
  }
}