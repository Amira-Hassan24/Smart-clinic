
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
//import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.scss'
})
export class DoctorDashboard implements OnInit {
  appointments: any[] = [];
  todayAppointments: any[] = [];
  isLoading = true;
  doctorId: number = 0;
  doctorName: string = '';

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

    const payload = JSON.parse(atob(token.split('.')[1]));
    this.doctorId = payload.id;
    this.doctorName = payload.sub;

    this.loadAppointments();
  }

  loadAppointments() {
    this.http.get<any[]>(`http://localhost:8080/api/doctor/${this.doctorId}/appointments`)
      .subscribe({
        next: (data) => {
          this.appointments = data;
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

  updateStatus(id: number, status: string) {
    this.http.put(`http://localhost:8080/api/appointments/update-status/${id}?status=${status}`, {})
      .subscribe({
        next: () => this.loadAppointments()
      });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
  get completedCount(): number {
  return this.appointments.filter(a => a.status === 'Completed').length;
}

get pendingCount(): number {
  return this.appointments.filter(a => a.status === 'Pending').length;
}
}