import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcoxQbitComponent } from './concox-qbit.component';

describe('ConcoxQbitComponent', () => {
  let component: ConcoxQbitComponent;
  let fixture: ComponentFixture<ConcoxQbitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcoxQbitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcoxQbitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
