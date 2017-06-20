import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { GetPostsQuery } from '../graphql/queries';
import { AddPostMutation } from '../graphql/mutations';


@Component({
  selector: 'new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  form: FormGroup;

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
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
    if (!this.form.valid) return;
    this.apollo.mutate({
      mutation: AddPostMutation,
      variables: {
        "data": {
          "title": this.form.value.title,
          "content" :this.form.value.content
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
