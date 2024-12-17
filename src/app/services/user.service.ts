import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // อัปเดตข้อมูลผู้ใช้
  updateUser(id: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token'); // ดึง Token จาก Local Storage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // ใส่ Token ใน Header
    });

    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers });
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
