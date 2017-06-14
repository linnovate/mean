import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Post } from '../shared/post';
import { PostsService } from '../shared/posts.service';
//import { BasicValidators } from '../../shared/basic-validators';

@Component({
  selector: 'post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  form: FormGroup;
  title: string;
  post: Post = new Post();

  constructor(
    formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService
  ) {
    this.form = formBuilder.group({
      title: ['', [
        Validators.required,
      ]],
    });
  }

  ngOnInit() {
    var id = this.route.params.subscribe(params => {
      var id = params['id'];

      this.title = id ? 'Edit Post' : 'New Post';

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

  save() {
    if (!this.form.valid) return;
    var result,
        postValue = this.form.value;

    if (postValue.id){
      result = this.postsService.updatePost(postValue);
    } else {
      result = this.postsService.addPost(postValue);
    }

    result.subscribe(data => this.router.navigate(['posts']));
  }
}