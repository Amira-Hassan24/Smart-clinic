import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.email, this.password).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      
      // decode token to get role
      const payload = JSON.parse(atob(res.token.split('.')[1]));
      console.log('Payload:',payload);
      const role = payload.role;
      localStorage.setItem('role', role);

      this.isLoading = false;

      if (role === 'ADMIN') {
        this.router.navigate(['/dashboard']);
      } else if (role === 'DOCTOR') {
        this.router.navigate(['/doctor-dashboard']);
      } else if (role === 'RECEPTIONIST') {
        this.router.navigate(['/receptionist-dashboard']);
      } else if (role === 'PATIENT') {
        this.router.navigate(['/patient-dashboard']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    },
    error: () => {
      this.errorMessage = 'Invalid email or password';
      this.isLoading = false;
    }
  });
}
}