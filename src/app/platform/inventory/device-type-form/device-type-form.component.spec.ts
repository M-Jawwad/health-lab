import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceTypeFormComponent } from './device-type-form.component';

describe('DeviceTypeFormComponent', () => {
  let component: DeviceTypeFormComponent;
  let fixture: ComponentFixture<DeviceTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceTypeFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
