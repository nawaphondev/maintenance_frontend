import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [SidebarComponent,RouterOutlet,CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardComponent {
  isSidebarVisible: boolean = false;

  toggleSidebar(): void {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
