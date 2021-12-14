import { TestBed } from '@angular/core/testing';

import { ValidatorService } from './validator.service';
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('ValidatorService', () => {
  let service: ValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
