import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  public subject = new Subject<any>();

  constructor(private http : HttpClient) {}


  save(data) {
    return this
      .http
      .post(`/api/entity`, data);
  }

  update(id, modeName, data) {
    return this
      .http
      .put(`/api/entity/${id}${modeName ? `/${modeName}`: ''}`, data);
  }

  findOne(id, modeName) {
    return this
      .http
      .get(`/api/entity/${id}${modeName ? `/${modeName}`: ''}`);
  }

  clone(id, modeName) {
    return this.http.get(`/api/entity/clone/${id}${modeName ? `/${modeName}`: ''}`);
  }

  delete(id, modeName) {
    return this
      .http
      .delete(`/api/entity/${id}${modeName ? `/${modeName}`: ''}`);
  }
}
