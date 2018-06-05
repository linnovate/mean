import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SchemaService {

  constructor(private http : HttpClient) {}

  find(type) : Observable <any> {
    return this.http.get(`/api/schema?type=${type}`);
  }

  findOne(id) : Observable <any> {
    return this.http.get(`/api/schema/${id}`);
  }
  
}
