import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators'

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
  find() : Observable <any> {
    return Observable.create(observer => {
     this.http.get(`/api/entity-data`).subscribe((result: any) => {
      const _result = result.map(res => {
        return {
          schemaId: res._id,
          data: res.data.map((d:any) => {
            d.data = JSON.parse(d.data);
            return d;
          })
        }
      });
      observer.next(_result);
      observer.complete();
     });
    })
  }

}