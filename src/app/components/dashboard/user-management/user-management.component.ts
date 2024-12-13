import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent {
  user: any = {
    username: '',
    email: '',
    password: '',
    user_level: 'User',
    profile_picture: null,
    status: 'Active',
  };

  constructor(private userService: UserService) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profile_picture = reader.result; // Convert file to Base64
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    const formData = {
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      user_level: this.user.user_level,
      profile_picture: this.user.profile_picture, // Send Base64 string
      status: this.user.status,
    };

    this.userService.createUser(formData).subscribe(
      (response) => {
        console.log('User added successfully:', response);
        alert('User added successfully!');
      },
      (error) => {
        console.error('Error adding user:', error);
        alert('An error occurred while adding the user.');
      }
    );
  }
}
