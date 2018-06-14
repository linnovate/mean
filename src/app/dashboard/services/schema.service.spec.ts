import { TestBed, inject } from '@angular/core/testing';

import { SchemaService } from './schema.service';

describe('SchemaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchemaService]
    });
  });

  it('should be created', inject([SchemaService], (service: SchemaService) => {
    expect(service).toBeTruthy();
  }));
});
