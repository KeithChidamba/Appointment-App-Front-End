import { TestBed } from '@angular/core/testing';

import { TImetableViewGuard } from './timetable-view.guard';

describe('TImetableViewGuard', () => {
  let guard: TImetableViewGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TImetableViewGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
