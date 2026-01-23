import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === '12345') {
      localStorage.setItem('admin', 'true');
      this.router.navigate(['/admin/dashboard']);
    } else {
      alert('Invalid login');
    }
  }
  navigatetodashboard() {
    this.router.navigate(['dashboard']);
  }
}
