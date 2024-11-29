import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

// Interface สำหรับข้อมูล Credentials
export interface Credentials {
  emailOrUsername: string;
  password: string;
}

// Interface สำหรับข้อมูล User ที่ใช้ในการลงทะเบียน
export interface User {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  // ฟังก์ชันสำหรับเข้าสู่ระบบ
  login(credentials: Credentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error('Login error', error);
        return throwError(() => this.formatErrorMessage(error));
      })
    );
  }

  // ฟังก์ชันสำหรับลงทะเบียน
  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error('Register error', error);
        return throwError(() => this.formatErrorMessage(error));
      })
    );
  }

  // ฟังก์ชันสำหรับรีเซ็ตรหัสผ่านด้วยอีเมล
  resetPassword(email: string): Observable<any> {
    const payload = { email };
    return this.http.post(`${this.apiUrl}/reset-password`, payload, this.getHttpOptions()).pipe(
      catchError((error) => {
        console.error('Reset password error', error);
        return throwError(() => this.formatErrorMessage(error));
      })
    );
  }

  // ฟังก์ชันสำหรับดึงข้อมูลแดชบอร์ด
  getDashboard(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`, // ใช้ Token จาก LocalStorage
    });

    console.log('Headers:', headers); // ตรวจสอบ Headers ที่ส่งไป

    return this.http.get(`${this.apiUrl}/dashboard`, { headers }).pipe(
      catchError((error) => {
        console.error('Dashboard error', error);
        return throwError(() => this.formatErrorMessage(error));
      })
    );
  }


  // ฟังก์ชันสำหรับบันทึก token ลงใน localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ฟังก์ชันสำหรับดึง token จาก localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ฟังก์ชันตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  logout(): void {
    localStorage.removeItem('token');
  }

  // ฟังก์ชันสำหรับตั้งค่า HTTP Options เพื่อแก้ปัญหา CORS
  private getHttpOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  // ฟังก์ชันสำหรับแปลงข้อความข้อผิดพลาดให้เข้าใจง่ายขึ้น
  private formatErrorMessage(error: any): string {
    if (error && error.error) {
      try {
        const parsedError = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
        if (parsedError.error) {
          return parsedError.error;
        }
      } catch (e) {
        // ถ้าไม่สามารถแปลงข้อความ error ได้ ให้ใช้ข้อความเริ่มต้น
      }
    }
    return 'เกิดข้อผิดพลาด กรุณาลองใหม่';
  }
}
