import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecaseListComponent } from './usecase-list.component';

describe('UsecaseListComponent', () => {
  let component: UsecaseListComponent;
  let fixture: ComponentFixture<UsecaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsecaseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsecaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
