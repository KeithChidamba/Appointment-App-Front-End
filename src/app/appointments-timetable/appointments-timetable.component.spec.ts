import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsTimetableComponent } from './appointments-timetable.component';

describe('AppointmentsTimetableComponent', () => {
  let component: AppointmentsTimetableComponent;
  let fixture: ComponentFixture<AppointmentsTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentsTimetableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentsTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
