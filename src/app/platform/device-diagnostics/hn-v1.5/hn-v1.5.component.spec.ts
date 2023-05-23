import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HNV15Component } from './hn-v1.5.component';

describe('HNV15Component', () => {
  let component: HNV15Component;
  let fixture: ComponentFixture<HNV15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HNV15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HNV15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
