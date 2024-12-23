import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  userId: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // สร้างฟอร์ม resetPasswordForm ด้วยฟิลด์ oldPassword และ newPassword
    this.resetPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // ดึง userId จาก JWT Token ที่เก็บไว้ใน localStorage
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeJwt(token);
      if (decodedToken && decodedToken.userId) {
        this.userId = decodedToken.userId;
      } else {
        console.error('Invalid token');
        Swal.fire('Error', 'Unable to verify your identity. Please log in again', 'error');
      }
    }
  }

  /**
   * ฟังก์ชันถอดรหัส JWT Token
   */
  decodeJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }

  /**
   * รีเซ็ตรหัสผ่านโดยใช้ฟอร์ม resetPasswordForm
   * ถ้าฟอร์มไม่ถูกต้องจะแสดงข้อผิดพลาด
   * ถ้าการเปลี่ยนรหัสผ่านสำเร็จจะแสดงข้อความสำเร็จ
   * ถ้าการเปลี่ยนรหัสผ่านไม่สำเร็จจะแสดงข้อผิดพลาด
   */
  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      // แสดงข้อความแจ้งเตือนเมื่อฟอร์มไม่ถูกต้อง
      Swal.fire('Error', 'Please fill in the information correctly', 'error');
      return;
    }

    if (!this.userId) {
      Swal.fire('Error', 'Unable to verify your identity. Please log in again', 'error');
      return;
    }

    const { oldPassword, newPassword } = this.resetPasswordForm.value;

    // แสดงคำยืนยันก่อนเปลี่ยนรหัสผ่าน
    Swal.fire({
      title: 'Confirm password change?',
      text: 'Would you like to change your password?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, change your password.',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // เรียกใช้บริการ authService เพื่อเปลี่ยนรหัสผ่าน
        this.authService.resetPassword(this.userId as string, oldPassword, newPassword).subscribe(
          () => {
            // แสดงข้อความสำเร็จเมื่อเปลี่ยนรหัสผ่านได้สำเร็จ
            Swal.fire('Success', 'Your password has been successfully changed', 'success');
          },
          (error) => {
            // จัดการข้อผิดพลาดและแสดงข้อความแจ้งเตือนเมื่อไม่สามารถเปลี่ยนรหัสผ่านได้
            let errorMessage = 'Unable to change password. Please try again';
            if (error && error.error) {
              errorMessage = typeof error.error === 'string' ? error.error : error.error.message || errorMessage;
            }
            Swal.fire('Error', errorMessage, 'error');
          }
        );
      }
    });
  }
}
