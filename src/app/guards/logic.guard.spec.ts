import { TestBed } from '@angular/core/testing';

import { LogicGuard } from './logic.guard';

describe('LogicGuard', () => {
  let guard: LogicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
