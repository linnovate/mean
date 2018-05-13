import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { TokenStorage } from './token.storage';
import { TooltipComponent } from '@angular/material';

@Injectable()
export class AuthService {

  constructor(private http : HttpClient, private token: TokenStorage) {}

  login(email : string, password : string) : Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/login', {
        email: email,
        password: password
      }).subscribe(data: any => {
          observer.next({user: data.user});
          this.token.saveToken(data.token);
          observer.complete();
      })
    });
  }

  register(fullname : string, email : string, password : string, repeatPassword : string) : Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/register', {
        fullname: fullname,
        email: email,
        password: password,
        repeatPassword: repeatPassword
      }).subscribe(data => {
        observer.next({user: data.user});
        this.token.saveToken(data.token);
        observer.complete();
      })
    });
  }
}
