import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

// ตั้งค่า HTTP Options สำหรับคำขอ HTTP
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

// ฟังก์ชันสำหรับจัดการข้อผิดพลาดในการเชื่อมต่อ API
function handleError(error: any) {
  return throwError(error.error || 'Server error');
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ฟังก์ชันสำหรับดึงข้อมูลสรุปของ Dashboard
  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/summary`, httpOptions)
      .pipe(catchError(handleError));
  }

  // ฟังก์ชันสำหรับตรวจสอบสถานะการเข้าสู่ระบบ
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // ฟังก์ชันสำหรับลงทะเบียนผู้ใช้
  register(username: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, email, password, confirmPassword }, httpOptions)
      .pipe(catchError(handleError));
  }

  // ฟังก์ชันสำหรับเข้าสู่ระบบผู้ใช้
  login(emailOrUsername: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { emailOrUsername, password }, httpOptions)
      .pipe(catchError(handleError));
  }  

  // ฟังก์ชันสำหรับเปลี่ยนรหัสผ่านของผู้ใช้
  resetPassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/reset-password/${userId}`, { oldPassword, newPassword }, httpOptions)
      .pipe(catchError(handleError));
  }

  // ฟังก์ชันสำหรับแอดมินในการเปลี่ยนรหัสผ่านของผู้ใช้
  resetPasswordByAdmin(userId: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/reset-password/${userId}`, { newPassword }, httpOptions)
      .pipe(catchError(handleError));
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  logout(): void {
    localStorage.removeItem('token');
  }
}
