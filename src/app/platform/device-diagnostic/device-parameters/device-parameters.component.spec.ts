import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceParametersComponent } from './device-parameters.component';

describe('DeviceParametersComponent', () => {
  let component: DeviceParametersComponent;
  let fixture: ComponentFixture<DeviceParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceParametersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});