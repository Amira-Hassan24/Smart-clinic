import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { Doctors } from './features/doctors/doctors';
import { Patients } from './features/patients/patients';
import { Appointments } from './features/appointments/appointments';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { ResetPassword } from './features/auth/reset-password/reset-password';
import { DoctorDashboard } from './features/doctor-dashboard/doctor-dashboard';
import { ReceptionistDashboard } from './features/receptionist-dashboard/receptionist-dashboard';
import { PatientDashboard } from './features/patient-dashboard/patient-dashboard';
import { Prescriptions } from './features/prescriptions/prescriptions';
import { Invoices } from './features/invoices/invoices';
import { Settings } from './features/settings/settings';
import { authGuard } from './core/guards/auth-guard';
import { Queue } from './features/queue/queue';
import { Staff } from './features/staff/staff';
import { Schedule } from './features/schedule/schedule';
import { Profile } from './features/profile/profile';
import { Notifications } from './features/notifications/notifications';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'doctor-dashboard', component: DoctorDashboard, canActivate: [authGuard] },
  { path: 'receptionist-dashboard', component: ReceptionistDashboard, canActivate: [authGuard] },
  { path: 'patient-dashboard', component: PatientDashboard, canActivate: [authGuard] },
  { path: 'doctors', component: Doctors, canActivate: [authGuard] },
  { path: 'patients', component: Patients, canActivate: [authGuard] },
  { path: 'appointments', component: Appointments, canActivate: [authGuard] },
  { path: 'prescriptions', component: Prescriptions, canActivate: [authGuard] },
  { path: 'invoices', component: Invoices, canActivate: [authGuard] },
  { path: 'settings', component: Settings, canActivate: [authGuard] },
  { path: 'queue', component: Queue, canActivate: [authGuard] },
  { path: 'staff', component: Staff, canActivate: [authGuard] },
  { path: 'schedule', component: Schedule, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'notifications', component: Notifications, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];