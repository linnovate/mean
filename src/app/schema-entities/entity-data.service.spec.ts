import { TestBed, inject } from '@angular/core/testing';

import { EntityDataService } from './entity-data.service';

describe('EntityDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EntityDataService]
    });
  });

  it('should be created', inject([EntityDataService], (service: EntityDataService) => {
    expect(service).toBeTruthy();
  }));
});
