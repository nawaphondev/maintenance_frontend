// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // ใช้ URL จาก environment

  constructor(private http: HttpClient) { }

  // ลงทะเบียนผู้ใช้
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  // เข้าสู่ระบบผู้ใช้
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // รีเซ็ตรหัสผ่านของผู้ใช้
  resetPassword(userId: string, passwords: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/reset-password/${userId}`, passwords);
  }

  // รีเซ็ตรหัสผ่านโดยแอดมิน
  resetPasswordByAdmin(userId: string, newPassword: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/auth/reset-password/${userId}`, { newPassword });
  }

  // ดึงข้อมูลผู้ใช้ทั้งหมด (เฉพาะแอดมิน)
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/users`);
  }
}
