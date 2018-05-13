import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { 
  MatCardModule,
  MatListModule,
  MatInputModule,
  MatButtonModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDialogModule,
 } from '@angular/material';


import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { TokenStorage } from './token.storage';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatDialogModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  providers: [
    AuthService,
    TokenStorage
  ]
})
export class AuthModule { }
