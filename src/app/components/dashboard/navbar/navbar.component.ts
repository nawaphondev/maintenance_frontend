import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class NavbarComponent {
  constructor(private router: Router) {}

   logout() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, Logout',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem('token'); 
          this.router.navigate(['/login']); 
          Swal.fire('Logged out!', 'You have been logged out.', 'success');
        }
      });
    }
}
