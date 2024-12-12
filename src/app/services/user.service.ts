import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`; // ใช้ค่า URL จาก environment

  constructor(private http: HttpClient) {}

  // ดึงข้อมูลผู้ใช้ปัจจุบัน
  getCurrentUser(): Observable<any> {
    const token = localStorage.getItem('authToken'); // ดึง JWT จาก Local Storage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/me`, { headers });
  }

  // ดึงรูปภาพโปรไฟล์ผ่าน Endpoint (หากใช้บริการไฟล์รูปภาพ)
  getProfilePicture(userId: string): string {
    return `${this.apiUrl}/${userId}/profile-picture`;
  }
}
