import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementAddComponent } from './user-management-add.component';

describe('UserManagementAddComponent', () => {
  let component: UserManagementAddComponent;
  let fixture: ComponentFixture<UserManagementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
