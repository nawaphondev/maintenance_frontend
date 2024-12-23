import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe(
        (response) => {
          localStorage.setItem('token', response.token);
          Swal.fire(
            'Login Successful',
            'Click "OK" to go to the Dashboard',
            'success'
          ).then(() => {
            this.router.navigate(['/dashboard']);
          });
        },
        (error) => {
          console.error('Login error:', error); // Debugging
          let errorMessage = 'Login failed. Please check your information';
          if (error.status === 400 && error.error) {
            errorMessage =
              typeof error.error === 'string'
                ? error.error
                : error.error.message || errorMessage;
          }
          Swal.fire('Error', errorMessage, 'error');
        }
      );
    } else {
      Swal.fire('Login failed', 'Please fill in all information completely', 'error');
    }
  }
}
