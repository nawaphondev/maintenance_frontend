import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // ตรวจสอบให้แน่ใจว่าคุณมี AuthService เพื่อใช้ในการเช็คสถานะผู้ใช้

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // อนุญาตการเข้าถึงเส้นทาง
    } else {
      this.router.navigate(['/login']); // ถ้าไม่ได้ล็อกอิน ให้ไปที่หน้า Login
      return false;
    }
  }
}
