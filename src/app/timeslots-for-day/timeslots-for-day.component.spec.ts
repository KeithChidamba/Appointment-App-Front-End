import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeslotsForDayComponent } from './timeslots-for-day.component';

describe('TimeslotsForDayComponent', () => {
  let component: TimeslotsForDayComponent;
  let fixture: ComponentFixture<TimeslotsForDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeslotsForDayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeslotsForDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
