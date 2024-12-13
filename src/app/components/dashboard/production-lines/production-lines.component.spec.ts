import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLinesComponent } from './production-lines.component';

describe('ProductionLinesComponent', () => {
  let component: ProductionLinesComponent;
  let fixture: ComponentFixture<ProductionLinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionLinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionLinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
