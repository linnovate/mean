import { TestBed, inject } from '@angular/core/testing';

import { SystemService } from './system.service';

describe('LoadedPlatformService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemService]
    });
  });

  it('should be created', inject([SystemService], (service: SystemService) => {
    expect(service).toBeTruthy();
  }));
});
