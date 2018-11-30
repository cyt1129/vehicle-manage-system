import { TestBed, inject } from '@angular/core/testing';

import { GpsServiceService } from './gps-service.service';

describe('GpsServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpsServiceService]
    });
  });

  it('should be created', inject([GpsServiceService], (service: GpsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
