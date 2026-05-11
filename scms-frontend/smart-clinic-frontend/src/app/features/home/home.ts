import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  features = [
    {
      icon: '📅',
      title: 'Smart Appointments',
      desc: 'Book and manage appointments easily with real-time slot availability'
    },
    {
      icon: '👨‍⚕️',
      title: 'Doctor Management',
      desc: 'Manage doctors schedules, specializations and performance metrics'
    },
    {
      icon: '🏥',
      title: 'Queue Management',
      desc: 'Real-time queue visualization with priority handling for emergencies'
    },
    {
      icon: '💊',
      title: 'Prescriptions',
      desc: 'Digital prescriptions and complete medical history tracking'
    },
    {
      icon: '📊',
      title: 'Admin Dashboard',
      desc: 'Full KPIs, audit logs and clinic performance analytics'
    },
    {
      icon: '🔔',
      title: 'Smart Notifications',
      desc: 'Automated reminders and real-time alerts for all users'
    }
  ];

  stats = [
    { number: '1000+', label: 'Patients Served' },
    { number: '50+', label: 'Doctors' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];
}
