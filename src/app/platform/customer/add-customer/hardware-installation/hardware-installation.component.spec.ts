import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareInstallationComponent } from './hardware-installation.component';

describe('HardwareInstallationComponent', () => {
  let component: HardwareInstallationComponent;
  let fixture: ComponentFixture<HardwareInstallationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HardwareInstallationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
