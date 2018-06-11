import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

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

  clone(id) {
    return this.http.get(`/api/entity/${id}/clone`);
  }

  delete(id, modeName) {
    return this
      .http
      .delete(`/api/entity/${id}${modeName ? `/${modeName}`: ''}`);
  }
}
