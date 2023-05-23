import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HNV1Component } from './hn-v1.0.component';

describe('HNV1Component', () => {
  let component: HNV1Component;
  let fixture: ComponentFixture<HNV1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HNV1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HNV1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
