import { TestBed } from '@angular/core/testing';

import { AppointmentGuard } from './appointment-edit.guard';

describe('AppointmentGuard', () => {
  let guard: AppointmentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AppointmentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
