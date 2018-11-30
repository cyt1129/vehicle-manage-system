import { TestBed, inject } from '@angular/core/testing';

import { GpsCoordService } from './gps-coord.service';

describe('GpsCoordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpsCoordService]
    });
  });

  it('should be created', inject([GpsCoordService], (service: GpsCoordService) => {
    expect(service).toBeTruthy();
  }));
});
