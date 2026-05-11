import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss'
})
export class Notifications implements OnInit {
  role = localStorage.getItem('role');
  notifications: any[] = [];
  isLoading = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadMockNotifications();
  }

  loadMockNotifications() {
    this.notifications = [
      {
        id: 1,
        type: 'appointment',
        icon: '📅',
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow at 10:00 AM',
        time: '2 hours ago',
        read: false
      },
      {
        id: 2,
        type: 'prescription',
        icon: '💊',
        title: 'New Prescription',
        message: 'Dr. has issued a new prescription for you',
        time: '1 day ago',
        read: false
      },
      {
        id: 3,
        type: 'system',
        icon: '🔔',
        title: 'System Update',
        message: 'Smart Clinic system has been updated',
        time: '2 days ago',
        read: true
      },
      {
        id: 4,
        type: 'queue',
        icon: '🏥',
        title: 'Queue Update',
        message: 'You are next in queue. Please proceed to room 3',
        time: '3 days ago',
        read: true
      }
    ];
    this.cdr.detectChanges();
  }

  markAsRead(id: number) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.cdr.detectChanges();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.cdr.detectChanges();
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }
}
