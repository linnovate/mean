import { Component, OnInit } from '@angular/core';
import {PostsService} from "./shared/posts.service";
import {Post} from "./shared/post";

@Component({
  selector: 'posts',
  providers: [
    PostsService
  ],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  private posts: Post[] = [];

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.postsService.getPosts()
      .subscribe(data => this.posts = data);
  }

}