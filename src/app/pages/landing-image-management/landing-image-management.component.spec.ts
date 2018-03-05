import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingImageManagementComponent } from './landing-image-management.component';

describe('LandingImageManagementComponent', () => {
  let component: LandingImageManagementComponent;
  let fixture: ComponentFixture<LandingImageManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingImageManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingImageManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
