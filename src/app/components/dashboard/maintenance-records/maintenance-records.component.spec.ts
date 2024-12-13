import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceRecordsComponent } from './maintenance-records.component';

describe('MaintenanceRecordsComponent', () => {
  let component: MaintenanceRecordsComponent;
  let fixture: ComponentFixture<MaintenanceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
