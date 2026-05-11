import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class Patients implements OnInit {
  patients: any[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users/all')
      .subscribe({
        next: (data) => {
          this.patients = data.filter(u => u.role === 'PATIENT');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  toggleStatus(id: number) {
    this.http.put(`http://localhost:8080/api/admin/users/${id}/toggle-status`, {})
      .subscribe({
        next: () => this.loadPatients()
      });
  }
  
}