import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SystemService {

  constructor(private http : HttpClient) { }

  save(data) {
    return this
      .http
      .post(`/api/system`, data);
  }

  find() {
    return this
      .http
      .get(`/api/system`);
  }
}