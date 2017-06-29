import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { PostByIdInterface } from '../graphql/schema';
import { GetPostDetailQuery } from '../graphql/queries';
import { UpdatePostMutation } from '../graphql/mutations';


@Component({
  selector: 'edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})
export class EditPostComponent {
 form: FormGroup;
  private sub: Subscription;
  public id;
  public post: any;

  constructor(
  formBuilder: FormBuilder,
    private route: ActivatedRoute,
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

  public ngOnInit(): void {
    const that = this
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.apollo.watchQuery<PostByIdInterface>({
      query: GetPostDetailQuery,
      variables: { "id": this.id }
    }).subscribe(({ data }) => {
      that.post = data.post;
       this.form.setValue({title: data.post.title, content: data.post.content});
    });
  }

  public save() {
    if (!this.form.valid) 
      return;
    this.apollo.mutate({
      mutation: UpdatePostMutation,
      variables: {
        "id": this.post.id,
        "data": {
          "title": this.form.value.title,
          "content": this.form.value.content
        }
      },
    })
      .take(1)
      .subscribe({
        next: ({ data }) => {
          console.log('edit post', data);
          // get edit data      
          this.router.navigate(['/posts']);
        }, error: (errors) => {
          console.log('there was an error sending the query', errors);
        }
      });
  }
}
