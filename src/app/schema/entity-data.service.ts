import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EntityDataService {

  constructor(private http : HttpClient) {}

  save(schemaId, data) {
    return this
      .http
      .post(`/api/entity-data/schema/${schemaId}`, data);
  }
  update(id, data) {
    return this
      .http
      .put(`/api/entity-data/${id}`, data);
  }
  findOne(id) {
    return this
      .http
      .get(`/api/entity-data/${id}`);
  }
  find() {
    return this.http.get(`/api/entity-data`);
  }

}