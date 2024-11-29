import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          Swal.fire('เข้าสู่ระบบสำเร็จ', 'เมื่อคลิ๊ก "OK" ระบบจะนำคุณไปยังหน้าหลัก', 'success').then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        (error) => {
          // ใช้ข้อความจากเซิร์ฟเวอร์
          const errorMessage = error.error?.error || 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล';
          const remainingTime = error.error?.remainingTime;
  
          if (remainingTime) {
            // แสดงข้อความพร้อมเวลานับถอยหลัง
            let timeLeft = remainingTime;
  
            const interval = setInterval(() => {
              if (timeLeft > 0) {
                Swal.update({
                  title: 'ข้อผิดพลาด',
                  html: `ล็อกอินล้มเหลวหลายครั้งเกินไป<br>กรุณาลองใหม่ใน <b>${timeLeft}</b> วินาที`,
                  icon: 'error',
                  showConfirmButton: false
                });
                timeLeft--;
              } else {
                clearInterval(interval);
                Swal.fire('พร้อมลองใหม่', 'คุณสามารถลองเข้าสู่ระบบได้แล้ว', 'info');
              }
            }, 1000);
  
            Swal.fire({
              title: 'ข้อผิดพลาด',
              html: `ล็อกอินล้มเหลวหลายครั้งเกินไป<br>กรุณาลองใหม่ใน <b>${timeLeft}</b> วินาที`,
              icon: 'error',
              showConfirmButton: false,
              willClose: () => clearInterval(interval) // หยุดการนับถอยหลังเมื่อผู้ใช้ปิดแจ้งเตือน
            });
          } else {
            Swal.fire('ข้อผิดพลาด', errorMessage, 'error');
          }
        }
      );
    } else {
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }
  }  
}
