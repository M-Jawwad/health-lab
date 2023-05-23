import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorsFormComponent } from './sensors-features-form.component';

describe('SensorsFormComponent', () => {
  let component: SensorsFormComponent;
  let fixture: ComponentFixture<SensorsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
