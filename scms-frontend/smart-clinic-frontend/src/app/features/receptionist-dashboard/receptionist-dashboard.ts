import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './receptionist-dashboard.html',
  styleUrl: './receptionist-dashboard.scss'
})
export class ReceptionistDashboard implements OnInit {
  todayAppointments: any[] = [];
  doctors: any[] = [];
  isLoading = true;
  showBookForm = false;
  successMessage = '';
  errorMessage = '';

  newAppointment = {
    doctorId: null,
    patientId: null,
    appointmentDate: '',
    appointmentType: 'EXAMINATION',
    chiefComplaint: '',
    isPriority: false
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTodayAppointments();
    this.loadDoctors();
  }

  loadTodayAppointments() {
    this.http.get<any[]>('http://localhost:8080/api/appointments/all')
      .subscribe({
        next: (data) => {
          const today = new Date().toDateString();
          this.todayAppointments = data.filter(a =>
            new Date(a.appointmentDate).toDateString() === today
          );
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

  checkIn(id: number) {
    this.http.put(`http://localhost:8080/api/appointments/check-in/${id}`, {})
      .subscribe({
        next: () => {
          this.successMessage = 'Patient checked in!';
          this.loadTodayAppointments();
          this.cdr.detectChanges();
        }
      });
  }

  bookAppointment() {
    this.http.post('http://localhost:8080/api/receptionist/appointments', this.newAppointment)
      .subscribe({
        next: () => {
          this.successMessage = 'Appointment booked!';
          this.showBookForm = false;
          this.loadTodayAppointments();
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'Failed to book appointment.';
          this.cdr.detectChanges();
        }
      });
  }

  updateStatus(id: number, status: string) {
    this.http.put(`http://localhost:8080/api/appointments/update-status/${id}?status=${status}`, {})
      .subscribe({
        next: () => this.loadTodayAppointments()
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
  get arrivedCount(): number {
  return this.todayAppointments.filter(a => a.status === 'Arrived').length;
}
}
