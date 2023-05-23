import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PkgFeaturComponent } from './features.component';

describe('PkgFeaturComponent', () => {
  let component: PkgFeaturComponent;
  let fixture: ComponentFixture<PkgFeaturComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PkgFeaturComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PkgFeaturComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});