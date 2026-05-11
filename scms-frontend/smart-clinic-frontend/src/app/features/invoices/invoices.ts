import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices implements OnInit {
  invoices: any[] = [];
  appointments: any[] = [];
  isLoading = true;
  showAddForm = false;
  errorMessage = '';
  successMessage = '';
  role = localStorage.getItem('role');

  newInvoice = {
    appointmentId: null,
    price: 0
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.http.get<any[]>('http://localhost:8080/api/appointments/all')
      .subscribe({
        next: (data) => {
          this.appointments = data.filter(a => a.status === 'Completed');
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  generateInvoice() {
    this.http.post(
      `http://localhost:8080/api/invoices/generate/${this.newInvoice.appointmentId}?price=${this.newInvoice.price}`,
      {}
    ).subscribe({
      next: (data: any) => {
        this.successMessage = 'Invoice generated successfully!';
        this.errorMessage = '';
        this.showAddForm = false;
        this.invoices.push(data);
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to generate invoice.';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }
}