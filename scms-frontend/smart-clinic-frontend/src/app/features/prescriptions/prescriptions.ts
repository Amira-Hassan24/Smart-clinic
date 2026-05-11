import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prescriptions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.scss'
})
export class Prescriptions implements OnInit {
  prescriptions: any[] = [];
  isLoading = true;
  showAddForm = false;
  errorMessage = '';
  successMessage = '';
  role = localStorage.getItem('role');

  newPrescription = {
    appointmentId: null,
    diagnosis: '',
    medicines: ''
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPrescriptions();
  }

  loadPrescriptions() {
    this.http.get<any[]>('http://localhost:8080/api/appointments/all')
      .subscribe({
        next: (data) => {
          const completedApts = data.filter(a => a.status === 'Completed');
          const ids = completedApts.map(a => a.id);
          this.http.get<any[]>('http://localhost:8080/api/doctor/patient/0/history')
            .subscribe({
              next: () => {},
              error: () => {}
            });
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadAllPrescriptions() {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const id = payload.id || 0;

    this.http.get<any[]>(`http://localhost:8080/api/patient/${id}/prescriptions`)
      .subscribe({
        next: (data) => {
          this.prescriptions = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.http.get<any[]>(`http://localhost:8080/api/doctor/patient/${id}/history`)
            .subscribe({
              next: (data) => {
                this.prescriptions = data;
                this.isLoading = false;
                this.cdr.detectChanges();
              },
              error: () => {
                this.isLoading = false;
                this.cdr.detectChanges();
              }
            });
        }
      });
  }

  addPrescription() {
    this.http.post(
      `http://localhost:8080/api/prescriptions/add/${this.newPrescription.appointmentId}?diagnosis=${this.newPrescription.diagnosis}&medicines=${this.newPrescription.medicines}`,
      {}
    ).subscribe({
      next: () => {
        this.successMessage = 'Prescription added successfully!';
        this.errorMessage = '';
        this.showAddForm = false;
        this.loadAllPrescriptions();
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to add prescription.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit() {
    this.loadAllPrescriptions();
  }
}