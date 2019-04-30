import { TestBed, inject } from '@angular/core/testing';

import { TariffService } from './tariff.service';

describe('TariffService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TariffService]
    });
  });

  it('should be created', inject([TariffService], (service: TariffService) => {
    expect(service).toBeTruthy();
  }));
});
