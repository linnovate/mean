import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators'

@Injectable()
export class EntityService {

  constructor(private http : HttpClient) {}

  save(schemaId, data) {
    return this
      .http
      .post(`/api/entity/schema/${schemaId}`, data);
  }
  update(id, data) {
    return this
      .http
      .put(`/api/entity/${id}`, data);
  }
  findOne(id) {
    return this
      .http
      .get(`/api/entity/${id}`);
  }
  clone(id) {
    return this.http.get(`/api/entity/${id}/clone`);
  }
  delete(id) {
    return this.http.delete(`/api/entity/${id}`);
  }
  find(type) : Observable <any> {
    return Observable.create(observer => {
     this.http.get(`/api/entity/type/${type}`).subscribe((result: any) => {
       let _entities = {}, entities = [];
      result.forEach(entity => {
        const category = entity._schema.category;
        if (!_entities[category]) _entities[category] = [];
        _entities[category].push(entity);
      });
      for (let index in _entities) {
        entities.push({
          category: index,
          entities: _entities[index]
        });
      }
      observer.next(entities);
      observer.complete();
     });
    })
  }

}