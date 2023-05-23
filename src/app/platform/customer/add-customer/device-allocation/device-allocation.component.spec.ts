import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceAllocationComponent } from './device-allocation.component';

describe('DeviceAllocationComponent', () => {
  let component: DeviceAllocationComponent;
  let fixture: ComponentFixture<DeviceAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
