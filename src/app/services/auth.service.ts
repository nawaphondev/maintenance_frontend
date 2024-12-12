import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = `${environment.apiUrl}/auth`;; // Replace with your API endpoint
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkToken();
  }

  /**
   * Login user
   * @param credentials { email: string, password: string }
   * @returns Observable
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true);
      })
    );
  }

  /**
   * Register user
   * @param userDetails { email, password, username, etc. }
   * @returns Observable
   */
  register(userDetails: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userDetails);
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth/sign-in']);
  }

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Observable for login status
   * @returns Observable<boolean>
   */
  getLoggedInStatus(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  /**
   * Check and validate token on app load
   */
  private checkToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally validate token with backend
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }
}
