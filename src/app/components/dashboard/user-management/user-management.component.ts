import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class UserManagementComponent implements OnInit {
  users: any[] = []; // เก็บข้อมูลผู้ใช้ทั้งหมด
  showModal: boolean = false; // เปิด/ปิด Popup
  editMode: boolean = false; // โหมดแก้ไขหรือเพิ่มผู้ใช้
  userForm!: FormGroup; // ฟอร์มผู้ใช้
  imageUrl: string | ArrayBuffer | null = null; // รองรับ null โดยมีค่าเริ่มต้น
  selectedFile: File | null = null; // ไฟล์รูปที่อัปโหลด
  currentUserId: number | null = null; // เก็บ ID ของผู้ใช้ที่แก้ไข
  currentPage: number = 1;
  pageSize: number = 6;

  // Visibility controls for password fields
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUsers(); // ดึงข้อมูลผู้ใช้จาก API
  }

  // Toggle password visibility
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.users.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // ฟังก์ชันดึงข้อมูลผู้ใช้ทั้งหมดจาก API
  fetchUsers() {
    this.userService.getAllUsers().subscribe((data) => {
      this.users = data;
    });
  }

  // สร้าง FormGroup
  initializeForm() {
    this.userForm = this.fb.group({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      user_level: '',
      status: '',
      profile_picture: [null],
    });
  }

  // เปิดฟอร์มสำหรับแก้ไขผู้ใช้
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
    this.imageUrl = user.profile_picture || null;
    this.selectedFile = null;
  }

  // เปิดฟอร์มสำหรับเพิ่มผู้ใช้ใหม่
  openAddPopup() {
    this.editMode = false;
    this.showModal = true;
    console.log('Popup Status:', this.showModal);
    this.initializeForm();
    this.imageUrl = null;
    this.selectedFile = null;
  }

  // อัปโหลดไฟล์รูปภาพ
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageUrl = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  // ลบผู้ใช้
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
          Swal.fire(
            'succeed!',
            'User has been successfully deleted',
            'success'
          );
          this.fetchUsers(); // โหลดข้อมูลใหม่
        });
      }
    });
  }

  // บันทึกข้อมูลผู้ใช้
  onSubmit() {
    const formData = new FormData();
    formData.append('username', this.userForm.value.username);
    formData.append('email', this.userForm.value.email);
    formData.append('password', this.userForm.value.password);
    formData.append('user_level', this.userForm.value.user_level);
    formData.append('status', this.userForm.value.status);
    if (this.selectedFile) {
      formData.append('profile_picture', this.selectedFile);
    }

    // console.log('Form Data Entries:');
    // for (const entry of formData.entries()) {
    //   console.log(entry[0], entry[1]);
    // }

    // Swal Confirm Dialog
    Swal.fire({
      title: 'Confirm recording?',
      text: this.editMode
        ? 'Do you want to save this edit?'
        : 'Do you want to add this user?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, save it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.editMode && this.currentUserId) {
          this.userService
            .updateUser(this.currentUserId, formData)
            .subscribe(() => {
              Swal.fire(
                'Succeed!',
                'The edit has been saved successfully',
                'success'
              );
              this.fetchUsers();
              this.showModal = false;
            });
        } else {
          this.userService.createUser(formData).subscribe(
            () => {
              Swal.fire('Succeed!', 'User added successfully', 'success');
              this.fetchUsers();
              this.showModal = false;
            },
            (error) => {
              console.error('Error:', error); // Log error details
            }
          );
        }
      }
    });
  }
}
