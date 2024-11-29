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

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * รีเซ็ตรหัสผ่านโดยใช้ฟอร์ม resetPasswordForm
   * ถ้าฟอร์มไม่ถูกต้องจะแสดงข้อผิดพลาด
   * ถ้าการส่งอีเมลสำเร็จจะแสดงข้อความสำเร็จ
   * ถ้าการส่งอีเมลไม่สำเร็จจะแสดงข้อผิดพลาด
   */
  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ถูกต้อง', 'error');
      return;
    }

    const { email } = this.resetPasswordForm.value;

    Swal.fire({
      title: 'ยืนยันการรีเซ็ตรหัสผ่าน?',
      text: `คุณต้องการส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมล ${email} หรือไม่`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ส่งลิงก์',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.resetPassword(email).subscribe(
          () => {
            Swal.fire('สำเร็จ', 'ลิงก์รีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว', 'success');
          },
          (error) => {
            let errorMessage = 'ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้ กรุณาลองใหม่';
            if (error && error.error) {
              try {
                const parsedError = JSON.parse(error.error);
                if (parsedError.error) {
                  errorMessage = parsedError.error;
                }
              } catch (e) {
                // ถ้าไม่สามารถแปลงข้อความ error ได้ ให้ใช้ข้อความเริ่มต้น
              }
            }
            Swal.fire('ข้อผิดพลาด', errorMessage, 'error');
          }
        );
      }
    });
  }
}
