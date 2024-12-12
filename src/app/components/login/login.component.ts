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
  passwordVisible: boolean = false; // สถานะการมองเห็นรหัสผ่าน

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // สร้างฟอร์มการเข้าสู่ระบบ
    this.loginForm = this.fb.group({
      emailOrUsername: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { emailOrUsername, password } = this.loginForm.value;

      // เรียกใช้ AuthService เพื่อเข้าสู่ระบบ
      this.authService.login(emailOrUsername, password).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          Swal.fire('เข้าสู่ระบบสำเร็จ', 'เมื่อคลิ๊ก "OK" ระบบจะนำคุณไปยัง Dashboard', 'success').then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        (error) => {
          let errorMessage = 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล';
          if (error.status === 400 && error.error) {
            if (typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            }
          }
          Swal.fire('ข้อผิดพลาด', errorMessage, 'error');
        }
      );
    } else {
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
    }
  }
}
