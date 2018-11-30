import { TestBed, inject } from '@angular/core/testing';

import { AlarmService } from './alarm.service';

describe('AlarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlarmService]
    });
  });

  it('should be created', inject([AlarmService], (service: AlarmService) => {
    expect(service).toBeTruthy();
  }));
});
