import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceDiagnosticsComponent } from './device-diagnostics.component';

describe('DeviceDiagnosticsComponent', () => {
  let component: DeviceDiagnosticsComponent;
  let fixture: ComponentFixture<DeviceDiagnosticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceDiagnosticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceDiagnosticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
