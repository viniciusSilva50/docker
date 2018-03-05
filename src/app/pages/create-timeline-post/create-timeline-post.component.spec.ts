import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTimelinePostComponent } from './create-timeline-post.component';

describe('CreateTimelinePostComponent', () => {
  let component: CreateTimelinePostComponent;
  let fixture: ComponentFixture<CreateTimelinePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTimelinePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTimelinePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
