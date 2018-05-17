import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class LoadedPlatformService {

  constructor(private http : HttpClient) { }

  save(data) {
    return this
      .http
      .post(`/api/loaded-platform`, data);
  }

  find() {
    return this
      .http
      .get(`/api/loaded-platform`);
  }
}