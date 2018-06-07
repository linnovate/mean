import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http : HttpClient) {}

  save(data) {
    console.log('save:', data)
  }

  update(id, data) {
    console.log('update:', id, data)
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
    console.log('delete:', id)
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
