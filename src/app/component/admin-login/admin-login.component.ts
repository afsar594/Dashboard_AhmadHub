import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  loginForm!: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
  ) {
    // Validators.email
    // , Validators.minLength(5), Validators.maxLength(8)
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log('Form Values:', this.loginForm.value);

    if (this.loginForm.valid) {
      let body = this.loginForm.value;
      let payload = {
        id: 0,
        username: body.email,
        email: body.email,
        pwd: body.password,
        role: 'Admin',
      };

      this.api.login(payload).subscribe((res: any) => {
        if (res.isSuccess) {
          this.router.navigate(['dashboard']);
        } else {
          alert(res.message);
        }
      });
    }
  }

  hasError(controlName: string, errorName: string) {
    return (
      this.submitted && this.loginForm.get(controlName)?.hasError(errorName)
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
