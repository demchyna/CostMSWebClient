import { TestBed, inject } from '@angular/core/testing';

import { MeterService } from './meter.service';

describe('MeterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeterService]
    });
  });

  it('should be created', inject([MeterService], (service: MeterService) => {
    expect(service).toBeTruthy();
  }));
});
