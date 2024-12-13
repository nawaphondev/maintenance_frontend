import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routes } from './app.routes';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { OverviewComponent } from './components/dashboard/overview/overview.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './components/dashboard/user-management/user-management.component';
import { UserManagementAddComponent } from './components/dashboard/user-management/user-management-add/user-management-add.component';
import { UserManagementEditComponent } from './components/dashboard/user-management/user-management-edit/user-management-edit.component';
import { MachinesComponent } from './components/dashboard/machines/machines.component';
import { MaintenanceRecordsComponent } from './components/dashboard/maintenance-records/maintenance-records.component';
import { NotificationsComponent } from './components/dashboard/notifications/notifications.component';
import { ProductionLinesComponent } from './components/dashboard/production-lines/production-lines.component';
import { ReportsComponent } from './components/dashboard/reports/reports.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RegisterComponent,
    LoginComponent,
    AppComponent,
    DashboardComponent,
    MachinesComponent,
    MaintenanceRecordsComponent,
    NotificationsComponent,
    ProductionLinesComponent,
    ReportsComponent,
    UserManagementComponent,
    UserManagementAddComponent,
    UserManagementEditComponent,
    SidebarComponent,
    OverviewComponent,
    NgApexchartsModule,
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot()
  ],
})
export class AppModule { }
