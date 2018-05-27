import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class SchemaService {

  constructor(private http : HttpClient) {}

  private activeSchema:Subject<any> = new BehaviorSubject<any>(1);
  activeSchema$ = this.activeSchema.asObservable();

  private equipmentSchemaId:Subject<any> = new BehaviorSubject<any>(1);
  equipmentSchemaId$ = this.equipmentSchemaId.asObservable();

  setSharedData(data) {
    if (data.activeSchema) this.activeSchema.next(data.activeSchema);
    if (data.equipmentSchemaId) this.equipmentSchemaId.next(data.equipmentSchemaId);
  }

  find(type) : Observable <any> {
    return this.http.get(`/api/schema?type=${type}`);
  }
  
}
