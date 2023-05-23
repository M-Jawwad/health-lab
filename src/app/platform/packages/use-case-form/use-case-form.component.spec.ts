import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsecaseFormComponent } from './use-case-form.component';

describe('UsecaseFormComponent', () => {
  let component: UsecaseFormComponent;
  let fixture: ComponentFixture<UsecaseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsecaseFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsecaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
