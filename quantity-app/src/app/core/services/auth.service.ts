import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, SignupRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<string> {
    return this.http.post(`${this.api}/auth/login`, data, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', data.email);
      })
    );
  }

  signup(data: SignupRequest): Observable<any> {
    return this.http.post(`${this.api}/auth/signup`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  getUserInitial(): string {
    return this.getUserEmail().charAt(0).toUpperCase() || 'U';
  }
}
