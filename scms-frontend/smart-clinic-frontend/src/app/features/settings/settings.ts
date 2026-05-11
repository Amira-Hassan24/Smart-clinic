import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings implements OnInit {
  role = localStorage.getItem('role');
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  changePassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  userId: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.id;
    }
  }

  onChangePassword() {
    if (this.changePassword.newPassword !== this.changePassword.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.put(`http://localhost:8080/api/auth/change-password/${this.userId}`, {
      oldPassword: this.changePassword.oldPassword,
      newPassword: this.changePassword.newPassword
    }).subscribe({
      next: () => {
        this.successMessage = 'Password changed successfully!';
        this.changePassword = { oldPassword: '', newPassword: '', confirmPassword: '' };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to change password. Check your old password.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}