import { TestBed } from '@angular/core/testing';

import { AppointmentBookingGuard } from './appointment-booking.guard';

describe('AppointmentBookingGuard', () => {
  let guard: AppointmentBookingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppointmentBookingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
