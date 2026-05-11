import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './appointments.html',
  styleUrl: './appointments.scss'
})
export class Appointments implements OnInit {
  appointments: any[] = [];
  doctors: any[] = [];
  isLoading = true;
  showAddForm = false;
  errorMessage = '';
  successMessage = '';

  newAppointment = {
    doctorId: null,
    patientId: null,
    appointmentDate: '',
    appointmentType: 'EXAMINATION',
    chiefComplaint: '',
    isPriority: false
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadDoctors();
  }

  loadAppointments() {
    this.http.get<any[]>('http://localhost:8080/api/appointments/all')
      .subscribe({
        next: (data) => {
          this.appointments = data;
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

  bookAppointment() {
    this.http.post('http://localhost:8080/api/appointments/book', this.newAppointment)
      .subscribe({
        next: () => {
          this.successMessage = 'Appointment booked successfully!';
          this.errorMessage = '';
          this.showAddForm = false;
          this.loadAppointments();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to book appointment.';
          this.successMessage = '';
          this.cdr.detectChanges();
        }
      });
  }

  updateStatus(id: number, status: string) {
    this.http.put(`http://localhost:8080/api/appointments/update-status/${id}?status=${status}`, {})
      .subscribe({
        next: () => this.loadAppointments()
      });
  }

  deleteAppointment(id: number) {
    if (confirm('Are you sure?')) {
      this.http.delete(`http://localhost:8080/api/appointments/delete/${id}`)
        .subscribe({
          next: () => {
            this.successMessage = 'Appointment deleted!';
            this.loadAppointments();
            this.cdr.detectChanges();
          }
        });
    }
  }

  getStatusClass(status: string): string {
    const classes: any = {
      'Confirmed': 'confirmed',
      'Pending': 'pending',
      'Completed': 'completed',
      'Cancelled': 'cancelled',
      'Arrived': 'arrived',
      'In_consultation': 'in-consultation'
    };
    return classes[status] || 'pending';
  }
}