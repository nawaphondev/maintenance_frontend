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
  imageUrl: string | ArrayBuffer | null = null; // แสดงภาพตัวอย่าง
  selectedFile: File | null = null; // ไฟล์รูปภาพที่เลือก

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

      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        Swal.fire('Error', 'Please select the correct image file', 'error');
        return;
      }

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
      Swal.fire('Error', 'Please fill in the information completely and correctly', 'error');
      return;
    }

    if (!this.selectedFile) {
      Swal.fire('Error', 'Please upload a profile picture', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirm registration',
      text: 'Do you want to register?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('username', this.registerForm.get('username')?.value);
        formData.append('email', this.registerForm.get('email')?.value);
        formData.append('password', this.registerForm.get('password')?.value);
        formData.append(
          'confirmPassword',
          this.registerForm.get('confirmPassword')?.value
        );

        // ตรวจสอบก่อน append file
        if (this.selectedFile) {
          formData.append('profile_picture', this.selectedFile);
        } else {
          Swal.fire('Error', 'Please upload a profile picture', 'error');
          return;
        }

        this.authService.registerWithAvatar(formData).subscribe(
          (response) => {
            Swal.fire(
              'Registration completed',
              'The system will take you to the login page',
              'success'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          },
          (error) => {
            const errorMessage =
              error?.error?.error || 'Registration failed. Please try again';
            Swal.fire('Error', errorMessage, 'error');
          }
        );
      }
    });
  }
}
