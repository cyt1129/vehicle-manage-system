import { TestBed, inject } from '@angular/core/testing';

import { TelementryService } from './telemetry.service';

describe('TelementryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TelementryService]
    });
  });

  it('should be created', inject([TelementryService], (service: TelementryService) => {
    expect(service).toBeTruthy();
  }));
});
