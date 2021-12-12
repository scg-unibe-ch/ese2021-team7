import { TestBed } from '@angular/core/testing';

import { SelectHouseFormService } from './select-house-form.service';

describe('SelectHouseFormService', () => {
  let service: SelectHouseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectHouseFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
