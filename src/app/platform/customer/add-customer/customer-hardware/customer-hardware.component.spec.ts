import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerHardwareComponent } from './customer-hardware.component';

describe('CustomerHardwareComponent', () => {
  let component: CustomerHardwareComponent;
  let fixture: ComponentFixture<CustomerHardwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerHardwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerHardwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
