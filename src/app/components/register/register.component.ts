import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    // Initialize the form with validation rules
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  };

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      Swal.fire('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'error');
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
        const { email, username, password, confirmPassword } = this.registerForm.value;
        const user = { email, username, password, confirmPassword };
  
        this.authService.register(user).subscribe(
          (response) => {
            Swal.fire('ลงทะเบียนผู้ใช้สำเร็จ', 'เมื่อคลิ๊ก "OK" ระบบจะนำคุณไปยังหน้าเข้าสู่ระบบ', 'success').then(() => {
              this.router.navigate(['/login']);
            });
          },
          (error) => {
            if (error.status === 400 && error.error) {
              try {
                const parsedError = JSON.parse(error.error);
                if (parsedError.error) {
                  Swal.fire('ข้อผิดพลาด', parsedError.error, 'error');
                }
              } catch (e) {
                Swal.fire('ข้อผิดพลาด', 'การลงทะเบียนล้มเหลว กรุณาลองใหม่', 'error');
              }
            } else {
              Swal.fire('ข้อผิดพลาด', 'การลงทะเบียนล้มเหลว กรุณาลองใหม่', 'error');
            }
          }
        );
      }
    });
  }
}  