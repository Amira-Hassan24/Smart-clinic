import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule implements OnInit {
  schedules: any[] = [];
  isLoading = true;
  showAddForm = false;
  successMessage = '';
  errorMessage = '';
  doctorId: number = 0;

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  newSchedule = {
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload);
    this.doctorId = payload.id || payload.userId || payload.sub;
  }
  this.loadSchedules();
}
  loadSchedules() {
  this.http.get<any[]>(`http://localhost:8080/api/doctor/${this.doctorId}/appointments`)
    .subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
}
  addSchedule() {
  const payload = {
    dayOfWeek: this.newSchedule.dayOfWeek,
    startTime: this.newSchedule.startTime,
    endTime: this.newSchedule.endTime,
    doctor: { id: this.doctorId }
  };

  this.http.post(`http://localhost:8080/api/admin/schedules`, payload)
    .subscribe({
      next: (data: any) => {
        this.successMessage = 'Schedule added successfully!';
        this.errorMessage = '';
        this.showAddForm = false;
        this.schedules.push(data);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to add schedule.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
}

  deleteSchedule(id: number) {
    this.http.delete(`http://localhost:8080/api/admin/schedules/${id}`)
      .subscribe({
        next: () => {
          this.successMessage = 'Schedule deleted!';
          this.schedules = this.schedules.filter(s => s.id !== id);
          this.cdr.detectChanges();
        }
      });
  }
  hasSchedule(day: string): boolean {
  return this.schedules.some(s => s.dayOfWeek === day);
}

getScheduleForDay(day: string): any[] {
  return this.schedules.filter(s => s.dayOfWeek === day);
}
}