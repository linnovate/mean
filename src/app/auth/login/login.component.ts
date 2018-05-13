import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  email: string;
  password: string;

  ngOnInit() {
  }

  login(): void {
    this.authService.login(this.email, this.password)
    .subscribe(data => {
      if (data.data.login.error) return alert(data.data.login.error);
      // this.token.saveToken(data.data.login.token);
      // this.authService.setUser(data.data.login.user);
      // this.router.navigate(['home']);
    })
  }

}
