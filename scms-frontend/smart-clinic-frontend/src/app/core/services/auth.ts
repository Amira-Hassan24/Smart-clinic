import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
const ENV = environment as { production: boolean; apiUrl: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private apiUrl = environment.apiUrl;
  private apiUrl: string = (environment as any)['apiUrl'];
  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
  return this.http.post(`http://localhost:8080/api/auth/login`, { email, password });
}

register(data: any): Observable<any> {
  return this.http.post(`http://localhost:8080/api/auth/register`, data);
}
  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}