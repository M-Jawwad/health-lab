import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsConfigurationComponent } from './sensors-configuration.component';

describe('SensorsConfigurationComponent', () => {
  let component: SensorsConfigurationComponent;
  let fixture: ComponentFixture<SensorsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
