import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  imageUrl: string | ArrayBuffer | null = null; // สำหรับเก็บ URL ของรูปภาพที่อัปโหลด
  selectedFile: File | null = null; // เก็บไฟล์ที่เลือก

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  };

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result; // แสดงตัวอย่างรูปภาพ
      };

      reader.readAsDataURL(file);
      this.selectedFile = file; // เก็บไฟล์ที่เลือกไว้สำหรับส่งไป Backend
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'error');
      return;
    }

    if (!this.selectedFile) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาอัปโหลดรูปภาพโปรไฟล์', 'error');
      return;
    }

    Swal.fire({
      title: 'ยืนยันการลงทะเบียน?',
      text: 'คุณต้องการดำเนินการลงทะเบียนหรือไม่',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลงทะเบียน',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        const { email, username, password, confirmPassword } =
          this.registerForm.value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);
        formData.append('avatar', this.selectedFile as Blob);

        this.authService.registerWithAvatar(formData).subscribe(
          (response) => {
            Swal.fire(
              'ลงทะเบียนผู้ใช้สำเร็จ',
              'เมื่อคลิ๊ก "OK" ระบบจะนำคุณไปยังหน้าเข้าสู่ระบบ',
              'success'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          },
          (error) => {
            let errorMessage = 'การลงทะเบียนล้มเหลว กรุณาลองใหม่';

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
      }
    });
  }
}
