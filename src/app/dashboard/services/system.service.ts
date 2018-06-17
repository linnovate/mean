import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable({
  providedIn: 'root'
})
export class SystemService {

  constructor(private http : HttpClient) { }

  public events = new Subject<any>();

  save(data) {
    return this
      .http
      .post(`/api/system`, data);
  }

  update(id, data) {
    return this
      .http
      .put(`/api/system/${id}`, data);
  }

  find() {
    return this
      .http
      .get(`/api/system`);
  }

  findOne(id) {
    return this
      .http
      .get(`/api/system/${id}`);
  }
}

