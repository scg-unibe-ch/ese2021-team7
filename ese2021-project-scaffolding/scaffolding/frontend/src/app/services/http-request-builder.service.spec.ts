import { TestBed } from '@angular/core/testing';

import { HttpRequestBuilderService } from './http-request-builder.service';

describe('HttpRequestBuilderService', () => {
  let service: HttpRequestBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRequestBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
