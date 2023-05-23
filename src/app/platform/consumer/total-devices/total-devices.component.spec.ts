import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDevicesComponent } from './total-devices.component';

describe('TotalDevicesComponent', () => {
  let component: TotalDevicesComponent;
  let fixture: ComponentFixture<TotalDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalDevicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
