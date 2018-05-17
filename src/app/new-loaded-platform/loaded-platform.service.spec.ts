import { TestBed, inject } from '@angular/core/testing';

import { LoadedPlatformService } from './loaded-platform.service';

describe('LoadedPlatformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadedPlatformService]
    });
  });

  it('should be created', inject([LoadedPlatformService], (service: LoadedPlatformService) => {
    expect(service).toBeTruthy();
  }));
});
