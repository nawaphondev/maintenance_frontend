import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { OverviewComponent } from './overview/overview.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProductionLinesComponent } from './production-lines/production-lines.component';
import { MachinesComponent } from './machines/machines.component';
import { MaintenanceRecordsComponent } from './maintenance-records/maintenance-records.component';
import { ReportsComponent } from './reports/reports.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'production-lines', component: ProductionLinesComponent },
      { path: 'machines', component: MachinesComponent },
      { path: 'maintenance-records', component: MaintenanceRecordsComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'notifications', component: NotificationsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
