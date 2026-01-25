import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  loginForm: any;

  constructor(
    private router: Router,
    private api: ApiService,
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Values:', this.loginForm.value);
      this.api.login('').subscribe((r) => {
        alert('Login successful!');
      });
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.loginForm.get(controlName)?.hasError(errorName);
  }
  navigatetodashboard() {
    this.router.navigate(['dashboard']);
  }
}
