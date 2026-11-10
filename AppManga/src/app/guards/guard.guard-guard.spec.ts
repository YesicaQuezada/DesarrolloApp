import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { guardGuardGuard } from './guard.guard-guard';

describe('guardGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guardGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
