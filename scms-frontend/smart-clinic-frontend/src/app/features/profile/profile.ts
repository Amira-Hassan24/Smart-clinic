import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  role = localStorage.getItem('role');
  isLoading = true;
  isEditing = false;
  successMessage = '';
  errorMessage = '';

  profile = {
    id: 0,
    name: '',
    email: '',
    phoneNumber: '',
    role: '',
    isActive: true
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.http.get<any>('http://localhost:8080/api/profile/me')
      .subscribe({
        next: (data) => {
          this.profile = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          const token = localStorage.getItem('token');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            this.profile.email = payload.sub;
            this.profile.role = payload.role;
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }
}
