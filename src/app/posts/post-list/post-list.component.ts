import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import { Subject } from 'rxjs/Subject';
import { DocumentNode } from 'graphql';
import { PostsService } from '../posts.service';
import { MatSnackBar } from '@angular/material';


import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { PostsInterface } from '../graphql/schema';
@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  // Observable with GraphQL result
  public posts: ApolloQueryObservable<PostsInterface>;
  public listPostFilter: string;
  public postControl = new FormControl();
  private nameFilter: Subject<string> = new Subject<string>();

  // Inject Angular2Apollo service
  constructor(private _postService: PostsService, public snackBar: MatSnackBar) {
  }

  public ngOnInit() {
    this.posts = this._postService.get();
    // Add debounce time to wait 300 ms for a new change instead of keep hitting the server
    this.postControl.valueChanges.debounceTime(300).subscribe(name => {
      this.nameFilter.next(name);
    });
  }
  public deletePost(id: string) {
    this._postService.delete(id)
      .then((response) => {
        this.openSnackBar(response.message, 'Delete');
        this.posts.refetch();
      })
      .catch((error) => {
        this.openSnackBar(error.message, 'Delete');

      })
  }
  public openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }
}
