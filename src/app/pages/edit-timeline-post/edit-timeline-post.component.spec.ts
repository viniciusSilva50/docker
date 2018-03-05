import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimelinePostComponent } from './edit-timeline-post.component';

describe('EditTimelinePostComponent', () => {
  let component: EditTimelinePostComponent;
  let fixture: ComponentFixture<EditTimelinePostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTimelinePostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTimelinePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
