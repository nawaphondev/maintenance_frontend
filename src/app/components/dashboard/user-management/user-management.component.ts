import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  showModal = false;
  editMode = false;
  userForm!: FormGroup;
  currentUserId: number | null = null;
  selectedFile: File | null = null;
  imageBlob: ArrayBuffer | null = null;
  fileName: string = 'No file selected';
  imageUrl: string | null = null;
  passwordVisible: boolean = false; // ควบคุมการแสดง/ซ่อน Password
  confirmPasswordVisible: boolean = false; // ควบคุมการแสดง/ซ่อน Confirm Password

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUsers();
  }

  initializeForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confirmPassword: [''],
      user_level: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  fetchUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  openAddPopup() {
    this.editMode = false;
    this.showModal = true;
    this.userForm.reset();
    this.imageUrl = null;
    this.selectedFile = null;
    this.fileName = 'No file selected';
  }

  openEditPopup(user: any) {
    this.editMode = true;
    this.showModal = true;
    this.currentUserId = user.id;

    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      user_level: user.user_level,
      status: user.status,
    });

    this.imageUrl = user.profile_picture || 'https://via.placeholder.com/150';
  }

  closePopup() {
    this.showModal = false;
    this.userForm.reset();
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  createImageFromBlob(blob: any): string | null {
    if (!blob) return null;
    const byteArray = new Uint8Array(blob);
    const blobObject = new Blob([byteArray], { type: 'image/png' });
    return URL.createObjectURL(blobObject);
  }

  onSubmit() {
    if (this.userForm.invalid) {
      Swal.fire('Error', 'Please fill out all required fields.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('username', this.userForm.value.username);
    formData.append('email', this.userForm.value.email);
    formData.append('user_level', this.userForm.value.user_level);
    formData.append('status', this.userForm.value.status);

    // เพิ่มเฉพาะรูปภาพใหม่ที่อัปโหลด
    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
    }

    Swal.fire({
      title: this.editMode ? 'Confirm Update' : 'Confirm Creation',
      text: this.editMode
        ? 'Do you want to save changes to this user?'
        : 'Do you want to create this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.editMode && this.currentUserId) {
          // Update user
          this.userService.updateUser(this.currentUserId, formData).subscribe(
            () => {
              Swal.fire('Success', 'User updated successfully!', 'success');
              this.fetchUsers();
              this.closePopup();
            },
            (error) => {
              console.error('Error updating user:', error);
              Swal.fire(
                'Error',
                error.error.message || 'Failed to update user.',
                'error'
              );
            }
          );
        } else {
          // Create user
          this.userService.createUser(formData).subscribe(
            () => {
              Swal.fire('Success', 'User created successfully!', 'success');
              this.fetchUsers();
              this.closePopup();
            },
            (error) => {
              console.error('Error creating user:', error);
              Swal.fire(
                'Error',
                error.error.message || 'Failed to create user.',
                'error'
              );
            }
          );
        }
      }
    });
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: 'Confirm deletion?',
      text: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(() => {
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
          this.fetchUsers();
        });
      }
    });
  }
}
