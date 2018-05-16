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

  setActive(activeSchema) {
    this.activeSchema.next(activeSchema);
  }

  find() : Observable <any> {
    return this.http.get('/api/schema');
  }
  
}
