import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';



@Injectable()
export class PostsService {

  private url: string = "api/posts";
  private headers = new Headers({ 'Content-Type': 'application/json' });
  

  constructor(private http: Http) { }

  getPosts(){
    return this.http.get(this.url, {
        search: {
            title: 'pop'
        }
    })
      .map(res => res.json());
  }

  getPost(id){
    return this.http.get(this.getPostUrl(id))
      .map(res => res.json());
  }

  addPost(post){
    return this.http.post(this.url, JSON.stringify(post), {headers: this.headers})
      .map(res => res.json());
  }

  updatePost(post){
    return this.http.put(this.getPostUrl(post.id), JSON.stringify(post))
      .map(res => res.json());
  }

  deletePost(id){
    return this.http.delete(this.getPostUrl(id))
      .map(res => res.json());
  }

  private getPostUrl(id){
    return this.url + "/" + id;
  }
}