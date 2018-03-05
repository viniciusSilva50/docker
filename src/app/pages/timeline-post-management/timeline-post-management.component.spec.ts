import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePostManagementComponent } from './timeline-post-management.component';

describe('TimelinePostManagementComponent', () => {
  let component: TimelinePostManagementComponent;
  let fixture: ComponentFixture<TimelinePostManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinePostManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePostManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
