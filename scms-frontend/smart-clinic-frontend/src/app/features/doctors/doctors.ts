import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './doctors.html',
  styleUrl: './doctors.scss'
})
export class Doctors implements OnInit {
  doctors: any[] = [];
  isLoading = true;
  showAddForm = false;
  errorMessage = '';
  successMessage = '';

  newDoctor = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    specialization: '',
    consultationDuration: 15,
    specialty:'',
    clinicId: 1
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDoctors();
  }

  loadDoctors() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users/all')
      .subscribe({
        next: (data) => {
          this.doctors = data.filter(u => u.role === 'DOCTOR');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addDoctor() {
    this.http.post('http://localhost:8080/api/admin/doctors', this.newDoctor)
      .subscribe({
        next: () => {
          this.successMessage = 'Doctor added successfully!';
          this.showAddForm = false;
          this.loadDoctors();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to add doctor.';
          this.successMessage = '';
          this.cdr.detectChanges();
        }
      });
  }

  toggleStatus(id: number, isActive: boolean) {
    this.http.put(`http://localhost:8080/api/admin/users/${id}/toggle-status`, {})
      .subscribe({
        next: () => {
          this.loadDoctors();
        }
      });
  }

  deleteDoctor(id: number) {
    if (confirm('Are you sure you want to delete this doctor?')) {
      this.http.delete(`http://localhost:8080/api/admin/doctors/${id}`)
        .subscribe({
          next: () => {
            this.successMessage = 'Doctor deleted successfully!';
            this.loadDoctors();
            this.cdr.detectChanges();
          }
        });
    }
  }
}