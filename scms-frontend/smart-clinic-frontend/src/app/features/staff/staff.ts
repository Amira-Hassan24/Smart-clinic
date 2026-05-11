import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './staff.html',
  styleUrl: './staff.scss'
})
export class Staff implements OnInit {
  staff: any[] = [];
  doctors: any[] = [];
  isLoading = true;
  showAddForm = false;
  successMessage = '';
  errorMessage = '';

  newReceptionist = {
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    doctorId: null
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadStaff();
    this.loadDoctors();
  }

  loadStaff() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users/all')
      .subscribe({
        next: (data) => {
          this.staff = data.filter(u => u.role === 'RECEPTIONIST');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadDoctors() {
    this.http.get<any[]>('http://localhost:8080/api/admin/users/all')
      .subscribe({
        next: (data) => {
          this.doctors = data.filter(u => u.role === 'DOCTOR');
          this.cdr.detectChanges();
        }
      });
  }

  addReceptionist() {
    this.http.post(
      `http://localhost:8080/api/admin/staff/receptionist?doctorId=${this.newReceptionist.doctorId}`,
      {
        name: this.newReceptionist.name,
        email: this.newReceptionist.email,
        phoneNumber: this.newReceptionist.phoneNumber,
        password: this.newReceptionist.password
      }
    ).subscribe({
      next: () => {
        this.successMessage = 'Receptionist added successfully!';
        this.errorMessage = '';
        this.showAddForm = false;
        this.loadStaff();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to add receptionist.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  deleteStaff(id: number) {
    if (confirm('Are you sure?')) {
      this.http.delete(`http://localhost:8080/api/admin/staff/${id}`)
        .subscribe({
          next: () => {
            this.successMessage = 'Staff deleted!';
            this.loadStaff();
            this.cdr.detectChanges();
          }
        });
    }
  }

  toggleStatus(id: number) {
    this.http.put(`http://localhost:8080/api/admin/users/${id}/toggle-status`, {})
      .subscribe({
        next: () => this.loadStaff()
      });
  }
}