import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';  // ใช้การนำเข้าจาก Chart.js แบบ Auto เพื่อลดการลงทะเบียนด้วยตัวเอง
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalMachines: number = 0;
  totalMaintenanceRecords: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchDashboardData();
    this.renderMaintenanceChart();
  }

  // ฟังก์ชันสำหรับดึงข้อมูลเพื่อแสดงใน Dashboard
  fetchDashboardData(): void {
    this.authService.getDashboardSummary().subscribe(
      (data: any) => {
        this.totalUsers = data.totalUsers;
        this.totalMachines = data.totalMachines;
        this.totalMaintenanceRecords = data.totalMaintenanceRecords;
      },
      (error: any) => {
        console.error('Error fetching dashboard data:', error);
      }
    );
  }

  // ฟังก์ชันสำหรับแสดงกราฟ
  renderMaintenanceChart(): void {
    const ctx = document.getElementById('maintenanceChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Maintenance Records',
            data: [12, 19, 3, 5, 2, 3], // ข้อมูลตัวอย่าง
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // ฟังก์ชันสำหรับออกจากระบบ
  logout(): void {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      text: 'คุณแน่ใจว่าต้องการออกจากระบบหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}


