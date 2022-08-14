import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';

import { AuthService } from '@app/shared/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
})
export class RegisterComponent {
  constructor(private router: Router, private authService: AuthService) {}

  passwordsMatchValidator(
    control: UntypedFormControl
  ): ValidationErrors | null {
    const password = control.root.get('password');
    return password && control.value !== password.value
      ? {
          passwordMatch: true,
        }
      : null;
  }

  userForm = new UntypedFormGroup({
    fullname: new UntypedFormControl('', [Validators.required]),
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required]),
    repeatPassword: new UntypedFormControl('', [
      Validators.required,
      this.passwordsMatchValidator,
    ]),
  });

  get fullname(): AbstractControl {
    return this.userForm.get('fullname')!;
  }

  get email(): AbstractControl {
    return this.userForm.get('email')!;
  }

  get password(): AbstractControl {
    return this.userForm.get('password')!;
  }

  get repeatPassword(): AbstractControl {
    return this.userForm.get('repeatPassword')!;
  }

  register(): void {
    if (this.userForm.invalid) {
      return;
    }

    const { fullname, email, password, repeatPassword } =
      this.userForm.getRawValue();

    this.authService
      .register(fullname, email, password, repeatPassword)
      .subscribe(() => {
        this.router.navigate(['']);
      });
  }
}
