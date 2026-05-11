import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './queue.html',
  styleUrl: './queue.scss'
})
export class Queue implements OnInit, OnDestroy {
  queue: any[] = [];
  todayAppointments: any[] = [];
  isLoading = true;
  role = localStorage.getItem('role');
  selectedDoctorId: number | null = null;
  doctors: any[] = [];
  refreshInterval: any;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDoctors();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  startAutoRefresh() {
    this.refreshInterval = setInterval(() => {
      if (this.selectedDoctorId) {
        this.loadQueue();
      }
    }, 5000);
  }

  loadDoctors() {
  this.http.get<any[]>('http://localhost:8080/api/appointments/all')
    .subscribe({
      next: (data) => {
        const doctorIds = [...new Set(data.map(a => a.doctorId))];
        this.doctors = doctorIds.map(id => ({ id, name: `Doctor #${id}` }));
        if (this.doctors.length > 0) {
          this.selectedDoctorId = this.doctors[0].id;
          this.loadQueue();
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}

  loadQueue() {
    if (!this.selectedDoctorId) return;

    this.http.get<any[]>(`http://localhost:8080/api/receptionist/doctor/${this.selectedDoctorId}/today`)
      .subscribe({
        next: (data) => {
          this.todayAppointments = data;
          this.queue = this.sortQueue(data);
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  sortQueue(appointments: any[]): any[] {
    const priority: any = {
      'In_consultation': 0,
      'Arrived': 1,
      'Confirmed': 2,
      'Pending': 3,
      'Completed': 4,
      'Cancelled': 5
    };

    return appointments
      .filter(a => a.status !== 'Cancelled' && a.status !== 'Completed')
      .sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return (priority[a.status] || 99) - (priority[b.status] || 99);
      });
  }

  checkIn(id: number) {
    this.http.put(`http://localhost:8080/api/appointments/check-in/${id}`, {})
      .subscribe({
        next: () => {
          this.successMessage = 'Patient checked in!';
          this.loadQueue();
          this.cdr.detectChanges();
        }
      });
  }

  updateStatus(id: number, status: string) {
    this.http.put(`http://localhost:8080/api/appointments/update-status/${id}?status=${status}`, {})
      .subscribe({
        next: () => {
          this.successMessage = 'Status updated!';
          this.loadQueue();
          this.cdr.detectChanges();
        }
      });
  }

  getEstimatedWait(index: number): number {
    return index * 15;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'In_consultation': 'purple',
      'Arrived': 'teal',
      'Confirmed': 'blue',
      'Pending': 'yellow',
    };
    return colors[status] || 'gray';
  }

  onDoctorChange() {
    this.isLoading = true;
    this.loadQueue();
  }
}
