import { TestBed, inject } from '@angular/core/testing';

import { SystemService } from './system.service';

describe('SystemService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemService]
    });
  });

  it('should be created', inject([SystemService], (service: SystemService) => {
    expect(service).toBeTruthy();
  }));
});
